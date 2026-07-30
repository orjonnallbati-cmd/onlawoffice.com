"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";

interface CookieConsentDict {
  title: string;
  description: string;
  ok: string;
  privacyLink: string;
}

/**
 * Informative-only cookie notice. The site sets no optional cookies
 * (no analytics, marketing or profiling), so no consent choice is
 * required — the notice informs and links to the cookie policy.
 */
export default function CookieConsent({
  locale,
  dict,
}: {
  locale: Locale;
  dict: CookieConsentDict;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem("cookie-consent");
    if (!acknowledged) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("cookie-consent", "acknowledged");
    setVisible(false);
  };

  if (!visible) return null;

  const privacyPath = getLocalizedPath(locale, "privacy") + "#cookies";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-navy-700 border-t-2 border-gold shadow-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <p className="text-gray-300 text-sm leading-relaxed flex-1">
            {dict.description}{" "}
            <Link
              href={privacyPath}
              className="text-gold-300 hover:text-gold-200 underline underline-offset-2"
            >
              {dict.privacyLink}
            </Link>
            .
          </p>
          <button
            onClick={handleDismiss}
            className="shrink-0 px-6 py-2.5 bg-gold text-white hover:bg-gold-500 transition-colors text-sm font-semibold cursor-pointer"
          >
            {dict.ok}
          </button>
        </div>
      </div>
    </div>
  );
}
