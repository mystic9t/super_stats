"use client";

import { useState, useCallback, RefObject } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Share2, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ShareStatus = "idle" | "generating" | "success" | "error";

interface ShareButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  filename?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function ShareButton({
  targetRef,
  filename,
  variant = "ghost",
  size = "icon",
  className = "",
  label = "Share",
}: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const handleShare = useCallback(async () => {
    if (!targetRef.current) {
      toast.error("Nothing to share");
      return;
    }

    setStatus("generating");

    try {
      const dataUrl = await toPng(targetRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#0f0f23",
        filter: (node) => {
          // Exclude interactive elements from the capture
          const excludedClasses = ["share-button", "no-capture"];
          if (node.classList) {
            return !excludedClasses.some((cls) => node.classList.contains(cls));
          }
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = filename || `vibes-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setStatus("success");
      toast.success("Image saved!");

      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to generate image:", error);
      setStatus("error");
      toast.error("Failed to generate image");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [targetRef, filename, toast]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      disabled={status === "generating"}
      className={`share-button ${className}`}
      title={label}
      aria-label={label}
    >
      {status === "generating" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === "success" ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {label && size !== "icon" && (
        <span className="ml-2">{status === "success" ? "Saved!" : label}</span>
      )}
    </Button>
  );
}
