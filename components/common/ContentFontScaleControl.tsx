"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const STORAGE_KEY = "eptruth-content-font-scale";

const SCALE_OPTIONS = [
  { value: "0.9375", label: "Small" },
  { value: "1", label: "Med" },
  { value: "1.125", label: "Large" },
  { value: "1.25", label: "X-large" },
] as const;

type ScaleValue = (typeof SCALE_OPTIONS)[number]["value"];

function isScaleValue(value: string): value is ScaleValue {
  return SCALE_OPTIONS.some((option) => option.value === value);
}

type ContentFontScaleControlProps = {
  label: string;
};

export default function ContentFontScaleControl({ label }: ContentFontScaleControlProps) {
  const [scale, setScale] = useState<ScaleValue>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isScaleValue(saved)) {
        return saved;
      }
    } catch {
      // Ignore browser storage failures.
    }
    return "0.9375";
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--eptruth-content-font-scale", scale);
  }, [scale]);

  const handleChange = (value: string) => {
    if (!isScaleValue(value)) return;
    setScale(value);
    document.documentElement.style.setProperty("--eptruth-content-font-scale", value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
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
