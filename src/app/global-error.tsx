"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body className="antialiased">
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl">🌙</div>
            <h2 className="text-2xl font-bold">Cosmic Disturbance</h2>
            <p className="text-muted-foreground">
              A critical error has occurred. Please try again.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Error: {error.digest}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={reset} variant="default">
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
