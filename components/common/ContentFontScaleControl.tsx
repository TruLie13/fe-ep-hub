"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "eptruth-content-font-scale";

const SCALE_OPTIONS = [
  { value: "1", label: "Small" },
  { value: "1.125", label: "Med" },
  { value: "1.25", label: "Large" },
  { value: "1.375", label: "X-large" },
] as const;

type ScaleValue = (typeof SCALE_OPTIONS)[number]["value"];

function isScaleValue(value: string): value is ScaleValue {
  return SCALE_OPTIONS.some((option) => option.value === value);
}

type ContentFontScaleControlProps = {
  label: string;
};

const SCALE_STORAGE_EVENT = "eptruth-content-font-scale-change";
let hasHydrated = false;

function readStoredScale(): ScaleValue {
  if (!hasHydrated) {
    // Keep first client render identical to server markup.
    return "1";
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isScaleValue(saved)) {
      return saved;
    }
  } catch {
    // Ignore browser storage failures.
  }
  return "1";
}

function subscribeToScaleChange(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SCALE_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SCALE_STORAGE_EVENT, onStoreChange);
  };
}

export default function ContentFontScaleControl({ label }: ContentFontScaleControlProps) {
  // Keep hydration stable by returning server-safe default first.
  const scale = useSyncExternalStore(subscribeToScaleChange, readStoredScale, () => "1");

  useEffect(() => {
    hasHydrated = true;
    window.dispatchEvent(new Event(SCALE_STORAGE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--eptruth-content-font-scale", scale);
    // #region agent log
    fetch("http://127.0.0.1:7761/ingest/4c13ac3f-bbb9-48c9-a6ca-6d1ae895ca0a", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e909d1" },
      body: JSON.stringify({
        sessionId: "e909d1",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "components/common/ContentFontScaleControl.tsx:66",
        message: "Font scale synced to html variable",
        data: {
          scale,
          storageValue: typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null,
          htmlVar: document.documentElement.style.getPropertyValue("--eptruth-content-font-scale"),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [scale]);

  const handleChange = (value: string) => {
    if (!isScaleValue(value)) return;
    try {
      localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new Event(SCALE_STORAGE_EVENT));
    } catch {
      // Ignore browser storage failures.
    }
  };

  return (
    <FormControl size="small" sx={{ minWidth: 128 }}>
      <InputLabel id="content-font-size-label">{label}</InputLabel>
      <Select
        labelId="content-font-size-label"
        id="content-font-size"
        value={scale}
        label={label}
        onChange={(event) => handleChange(event.target.value)}
        MenuProps={{
          disableScrollLock: true,
          disableAutoFocusItem: true,
        }}
      >
        {SCALE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
