"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function GoogleAnalyticsPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const qs = searchParams?.toString();
    const pagePath = qs ? `${pathname}?${qs}` : pathname;

    let attempts = 0;
    const maxAttempts = 100;
    const tick = () => {
      if (typeof window.gtag === "function") {
        window.gtag("config", GA_ID, { page_path: pagePath });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        window.requestAnimationFrame(tick);
      }
    };
    tick();
  }, [pathname, searchParams]);

  return null;
}

/** Tracks SPA navigations; wrapped in Suspense for `useSearchParams`. */
export function GoogleAnalyticsPageView() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageViewInner />
    </Suspense>
  );
}

/** Loads gtag once from the root layout. Requires `NEXT_PUBLIC_GA_MEASUREMENT_ID`. */
export function GoogleAnalyticsScripts() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(GA_ID)}, { send_page_view: false });
        `}
      </Script>
    </>
  );
}
