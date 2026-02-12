"use client";

import { useEffect, useRef } from "react";

export function FaviconSwitcher() {
  const faviconRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Create favicon element if it doesn't exist
    if (!faviconRef.current) {
      faviconRef.current = document.createElement("link");
      faviconRef.current.rel = "icon";
      faviconRef.current.type = "image/svg+xml";
      document.head.appendChild(faviconRef.current);
    }

    // Set initial favicon based on current theme
    const isDark = document.documentElement.classList.contains("dark");
    if (faviconRef.current) {
      faviconRef.current.href = isDark ? "/moon.svg" : "/sun.svg";
    }

    // Watch for theme changes on html element
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      if (faviconRef.current) {
        faviconRef.current.href = isDarkNow ? "/moon.svg" : "/sun.svg";
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
