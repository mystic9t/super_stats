"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Vibes PWA registered:", registration.scope);
        })
        .catch((error) => {
          console.log("Vibes PWA registration failed:", error);
        });
    }
  }, []);

  return null;
}
