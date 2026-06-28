"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export default function Turnstile({ onVerify, onExpire, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.warn("Cloudflare Turnstile site key is missing. Skipping Turnstile widget rendering.");
      return;
    }

    const renderWidget = () => {
      if (typeof window !== "undefined" && (window as any).turnstile && containerRef.current) {
        // Clear any existing widget
        if (widgetIdRef.current) {
          try {
            (window as any).turnstile.remove(widgetIdRef.current);
          } catch (e) {}
        }

        try {
          const id = (window as any).turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            "expired-callback": () => {
              if (onExpire) onExpire();
            },
            "error-callback": () => {
              if (onError) onError();
            },
          });
          widgetIdRef.current = id;
        } catch (e) {
          console.error("Failed to render Turnstile widget:", e);
        }
      }
    };

    // If script is already loaded
    if (typeof window !== "undefined" && (window as any).turnstile) {
      renderWidget();
    } else {
      // Set callback for Turnstile script onload
      (window as any).onloadTurnstileCallback = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && typeof window !== "undefined" && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {}
      }
    };
  }, [siteKey, onVerify, onExpire, onError]);

  if (!siteKey) return null;

  return (
    <div className="flex justify-center my-4">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        async
        defer
        strategy="afterInteractive"
      />
      <div ref={containerRef} />
    </div>
  );
}
