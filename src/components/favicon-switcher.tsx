"use client";

import { useEffect, useState } from "react";

export function FaviconSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from html class
    const html = document.documentElement;
    const hasDarkClass = html.classList.contains("dark");
    setIsDark(hasDarkClass);

    // Watch for theme changes on html element
    const observer = new MutationObserver(() => {
      const isDarkNow = html.classList.contains("dark");
      setIsDark(isDarkNow);
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = isDark ? "/moon.svg" : "/sun.svg";
    }
  }, [isDark]);

  return null;
}
