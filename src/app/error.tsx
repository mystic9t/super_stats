"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl">🌙</div>
        <h2 className="text-2xl font-bold">Cosmic Disturbance</h2>
        <p className="text-muted-foreground">
          Something went wrong in the cosmos. The stars are working to realign.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">Error: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
