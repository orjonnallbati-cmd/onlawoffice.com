"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";

interface CookieConsentDict {
  title: string;
  description: string;
  acceptAll: string;
  acceptNecessary: string;
  privacyLink: string;
}

export default function CookieConsent({
  locale,
  dict,
}: {
  locale: Locale;
  dict: CookieConsentDict;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setVisible(false);
  };

  if (!visible) return null;

  const privacyPath = getLocalizedPath(locale, "privacy") + "#cookies";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-navy-700 border-t-2 border-gold shadow-2xl p-6 sm:p-8">
        {/* Title */}
        <h3 className="text-lg text-white mb-3">{dict.title}</h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-5">
          {dict.description}{" "}
          <a
            href={privacyPath}
            className="text-gold-300 hover:text-gold-200 underline underline-offset-2"
          >
            {dict.privacyLink}
          </a>
          .
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAcceptNecessary}
            className="flex-1 px-5 py-2.5 border border-white/25 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
          >
            {dict.acceptNecessary}
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-5 py-2.5 bg-gold text-white hover:bg-gold-500 transition-colors text-sm font-semibold cursor-pointer"
          >
            {dict.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
