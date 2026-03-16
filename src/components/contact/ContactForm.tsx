"use client";

import { useState, type FormEvent } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactForm({ dict }: { dict: Record<string, any> }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Check honeypot
    if (data.get("_gotcha")) return;

    try {
      const res = await fetch("https://formspree.io/f/xreylerv", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg
          className="w-12 h-12 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-bold text-green-800 mb-2">
          {dict.successTitle}
        </h3>
        <p className="text-green-600 text-sm">
          {dict.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-dark mb-1.5"
          >
            {dict.fullName}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-sm"
            placeholder={dict.namePlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-dark mb-1.5"
          >
            {dict.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-sm"
            placeholder={dict.emailPlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-dark mb-1.5"
          >
            {dict.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-sm"
            placeholder={dict.phonePlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-dark mb-1.5"
          >
            {dict.subject}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-sm"
            placeholder={dict.subjectPlaceholder}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-dark mb-1.5"
        >
          {dict.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-sm resize-none"
          placeholder={dict.messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-8 py-3.5 bg-navy text-white font-semibold rounded-md hover:bg-navy-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? dict.sending : dict.submit}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-sm">
          {dict.errorMessage}
        </p>
      )}
    </form>
  );
}
