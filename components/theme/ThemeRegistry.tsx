"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline } from "@mui/material";
import { CssVarsProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { appTheme } from "@/theme/createAppTheme";

type ThemeRegistryProps = {
  children: React.ReactNode;
};

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7761/ingest/4c13ac3f-bbb9-48c9-a6ca-6d1ae895ca0a", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e909d1" },
      body: JSON.stringify({
        sessionId: "e909d1",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "components/theme/ThemeRegistry.tsx:16",
        message: "ThemeRegistry mounted with client html state",
        data: {
          htmlClassName: document.documentElement.className,
          contentFontScale: document.documentElement.style.getPropertyValue("--eptruth-content-font-scale"),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <CssVarsProvider theme={appTheme} defaultMode="dark" storageManager={null}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </AppRouterCacheProvider>
  );
}
