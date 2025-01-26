"use client";

import { useConfig } from "@/app/context/ConfigContext";
import { useEffect } from "react";

export function FontSizeProvider() {
  const { fontSize } = useConfig();

  useEffect(() => {
    if (fontSize) {
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  return null;
}
