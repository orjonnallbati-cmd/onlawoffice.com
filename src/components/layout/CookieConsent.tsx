"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      <div className="max-w-4xl mx-auto bg-[#0f2a44] border border-[#C4A35A]/30 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#C4A35A]/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-[#C4A35A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">{dict.title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-5">
          {dict.description}{" "}
          <Link
            href={privacyPath}
            className="text-[#C4A35A] hover:text-[#d4b36a] underline underline-offset-2"
          >
            {dict.privacyLink}
          </Link>
          .
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAcceptNecessary}
            className="flex-1 px-5 py-2.5 border border-gray-500 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
          >
            {dict.acceptNecessary}
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-5 py-2.5 bg-[#C4A35A] text-[#1B3A5C] rounded-lg hover:bg-[#d4b36a] transition-colors text-sm font-bold cursor-pointer"
          >
            {dict.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
