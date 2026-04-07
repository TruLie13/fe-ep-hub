"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const STORAGE_KEY = "eptruth-content-font-scale";

const SCALE_OPTIONS = [
  { value: "0.9375", label: "15px" },
  { value: "1", label: "16px" },
  { value: "1.125", label: "18px" },
  { value: "1.25", label: "20px" },
] as const;

type ScaleValue = (typeof SCALE_OPTIONS)[number]["value"];

function isScaleValue(value: string): value is ScaleValue {
  return SCALE_OPTIONS.some((option) => option.value === value);
}

type ContentFontScaleControlProps = {
  label: string;
};

export default function ContentFontScaleControl({ label }: ContentFontScaleControlProps) {
  const [scale, setScale] = useState<ScaleValue>("0.9375");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isScaleValue(saved)) {
        setScale(saved);
        document.documentElement.style.setProperty("--eptruth-content-font-scale", saved);
        return;
      }
    } catch {
      // Ignore browser storage failures.
    }
    document.documentElement.style.setProperty("--eptruth-content-font-scale", "0.9375");
  }, []);

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
    <FormControl size="small" sx={{ minWidth: 112 }}>
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
