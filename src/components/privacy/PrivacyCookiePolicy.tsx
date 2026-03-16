"use client";

import { useState } from "react";
import { OFFICE } from "@/lib/constants";

/* ─── Accordion Item ─── */
function AccordionItem({
  icon,
  title,
  children,
  isOpen,
  onClick,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`bg-white border rounded-xl mb-3 overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-gold/50 shadow-lg"
          : "border-gray-200 shadow-sm hover:border-gold/30 hover:shadow-md"
      }`}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-3.5 w-full px-6 py-5 text-left hover:bg-gold/[0.03] transition-colors"
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
            isOpen
              ? "bg-gradient-to-br from-gold to-gold-300 text-navy"
              : "bg-gradient-to-br from-navy to-navy-600 text-gold-100"
          }`}
        >
          {icon}
        </div>
        <span className="flex-1 font-semibold text-[0.95rem] text-navy">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-gold" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 pl-[4.5rem] text-sm text-dark leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Highlight Box ─── */
function HighlightBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-r from-navy/[0.04] to-gold/[0.06] border-l-[3px] border-gold rounded-r-lg px-4 py-3.5 text-sm">
      {title && (
        <strong className="block text-navy mb-1 text-[0.9rem]">{title}</strong>
      )}
      {children}
    </div>
  );
}

/* ─── Main Component ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PrivacyCookiePolicy({ dict }: { dict: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies">("privacy");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  const pt = dict.privacyTab;
  const ct = dict.cookieTab;

  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold-100 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {dict.hero.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {dict.hero.title}
            <br />
            <span className="text-gold">{dict.hero.titleHighlight}</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            {dict.hero.subtitle}
          </p>
        </div>
      </section>

      {/* TABS */}
      <div className="flex justify-center gap-1 px-6 -mt-5 relative z-10">
        <button
          onClick={() => {
            setActiveTab("privacy");
            setOpenItem(null);
          }}
          className={`px-8 py-3.5 rounded-t-xl font-semibold text-sm border transition-all ${
            activeTab === "privacy"
              ? "bg-white text-navy border-gray-200 border-b-2 border-b-gold shadow-md"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:text-navy hover:bg-white"
          }`}
        >
          {dict.tabs.privacy}
        </button>
        <button
          onClick={() => {
            setActiveTab("cookies");
            setOpenItem(null);
          }}
          className={`px-8 py-3.5 rounded-t-xl font-semibold text-sm border transition-all ${
            activeTab === "cookies"
              ? "bg-white text-navy border-gray-200 border-b-2 border-b-gold shadow-md"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:text-navy hover:bg-white"
          }`}
        >
          {dict.tabs.cookies}
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-10 pb-20">
        {/* PRIVACY TAB */}
        {activeTab === "privacy" && (
          <div>
            {/* Intro Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-7 mb-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold to-navy rounded-l" />
              <h3 className="text-lg font-bold text-navy mb-3">
                {pt.introTitle}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {pt.introText}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {pt.updated}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {pt.lawReference}
                </div>
              </div>
            </div>

            {/* Section 1: Controller */}
            <AccordionItem icon="1" title={pt.sections.controller.title} isOpen={openItem === "p1"} onClick={() => toggle("p1")}>
              <p>{pt.sections.controller.text}</p>
              <HighlightBox title={pt.sections.controller.boxTitle}>
                <span className="text-gray-600">
                  {OFFICE.lawyer}<br />
                  NUIS: {OFFICE.nuis}<br />
                  Adresa: {OFFICE.address}<br />
                  Email: <a href={`mailto:${OFFICE.email}`} className="text-navy hover:text-gold transition-colors">{OFFICE.email}</a><br />
                  Tel: <a href={`tel:${OFFICE.phone.replace(/\s/g, "")}`} className="text-navy hover:text-gold transition-colors">{OFFICE.phone}</a>
                </span>
              </HighlightBox>
              <p>{pt.sections.controller.contactNote}</p>
            </AccordionItem>

            {/* Section 2: Data Collected */}
            <AccordionItem icon="2" title={pt.sections.dataCollected.title} isOpen={openItem === "p2"} onClick={() => toggle("p2")}>
              <p>{pt.sections.dataCollected.intro}</p>
              <p><strong className="text-navy">{pt.sections.dataCollected.contactFormTitle}</strong></p>
              <ul className="list-none space-y-1.5 ml-0">
                {pt.sections.dataCollected.contactFormItems.map((item: string) => (
                  <li key={item} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">{item}</li>
                ))}
              </ul>
              <p><strong className="text-navy">{pt.sections.dataCollected.technicalTitle}</strong></p>
              <ul className="list-none space-y-1.5 ml-0">
                {pt.sections.dataCollected.technicalItems.map((item: string) => (
                  <li key={item} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">{item}</li>
                ))}
              </ul>
              <p>{pt.sections.dataCollected.noSensitive}</p>
            </AccordionItem>

            {/* Section 3: Purpose */}
            <AccordionItem icon="3" title={pt.sections.purpose.title} isOpen={openItem === "p3"} onClick={() => toggle("p3")}>
              <p>{pt.sections.purpose.intro}</p>
              <HighlightBox title={pt.sections.purpose.contactResponse.title}>
                <span className="text-gray-600">{pt.sections.purpose.contactResponse.text}</span>
              </HighlightBox>
              <HighlightBox title={pt.sections.purpose.technicalFunction.title}>
                <span className="text-gray-600">{pt.sections.purpose.technicalFunction.text}</span>
              </HighlightBox>
              <HighlightBox title={pt.sections.purpose.legalObligation.title}>
                <span className="text-gray-600">{pt.sections.purpose.legalObligation.text}</span>
              </HighlightBox>
            </AccordionItem>

            {/* Section 4: Retention */}
            <AccordionItem icon="4" title={pt.sections.retention.title} isOpen={openItem === "p4"} onClick={() => toggle("p4")}>
              <p>{pt.sections.retention.intro}</p>
              <ul className="list-none space-y-1.5 ml-0">
                {pt.sections.retention.items.map((item: { label: string; text: string }) => (
                  <li key={item.label} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                    <strong className="text-navy">{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <p>{pt.sections.retention.afterExpiry}</p>
            </AccordionItem>

            {/* Section 5: Sharing */}
            <AccordionItem icon="5" title={pt.sections.sharing.title} isOpen={openItem === "p5"} onClick={() => toggle("p5")}>
              <p>{pt.sections.sharing.intro}</p>
              <p>{pt.sections.sharing.availableTo}</p>
              <ul className="list-none space-y-1.5 ml-0">
                {pt.sections.sharing.items.map((item: { label: string; text: string }) => (
                  <li key={item.label} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                    <strong className="text-navy">{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <p>{pt.sections.sharing.formNote}</p>
            </AccordionItem>

            {/* Section 6: Transfers */}
            <AccordionItem icon="6" title={pt.sections.transfers.title} isOpen={openItem === "p6"} onClick={() => toggle("p6")}>
              <p>{pt.sections.transfers.text1}</p>
              <p>{pt.sections.transfers.text2}</p>
            </AccordionItem>

            {/* Section 7: Rights */}
            <AccordionItem icon="7" title={pt.sections.rights.title} isOpen={openItem === "p7"} onClick={() => toggle("p7")}>
              <p>{pt.sections.rights.intro}</p>
              <ul className="list-none space-y-1.5 ml-0">
                {pt.sections.rights.items.map((item: { label: string; text: string }) => (
                  <li key={item.label} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                    <strong className="text-navy">{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <HighlightBox title={pt.sections.rights.exerciseTitle}>
                <span className="text-gray-600">
                  {pt.sections.rights.exerciseText.replace("{email}", "")}<a href={`mailto:${OFFICE.email}`} className="text-navy hover:text-gold transition-colors font-medium">{OFFICE.email}</a>
                </span>
              </HighlightBox>
            </AccordionItem>

            {/* Section 8: Complaint */}
            <AccordionItem icon="8" title={pt.sections.complaint.title} isOpen={openItem === "p8"} onClick={() => toggle("p8")}>
              <p>{pt.sections.complaint.intro}</p>
              <HighlightBox title={pt.sections.complaint.boxTitle}>
                <span className="text-gray-600">
                  {pt.sections.complaint.boxAddress}<br />
                  {pt.sections.complaint.boxTel}<br />
                  Web: <a href="https://www.idp.al" target="_blank" rel="noopener noreferrer" className="text-navy hover:text-gold transition-colors font-medium">{pt.sections.complaint.boxWeb}</a><br />
                  {pt.sections.complaint.boxEmail}
                </span>
              </HighlightBox>
              <p>{pt.sections.complaint.legalRemedy}</p>
            </AccordionItem>

            {/* Section 9: Automated */}
            <AccordionItem icon="9" title={pt.sections.automated.title} isOpen={openItem === "p9"} onClick={() => toggle("p9")}>
              <p>{pt.sections.automated.text}</p>
            </AccordionItem>

            {/* Section 10: Changes */}
            <AccordionItem icon="10" title={pt.sections.changes.title} isOpen={openItem === "p10"} onClick={() => toggle("p10")}>
              <p>{pt.sections.changes.text}</p>
              <p><strong className="text-navy">{pt.sections.changes.currentVersion}</strong> {pt.sections.changes.versionDate}</p>
            </AccordionItem>
          </div>
        )}

        {/* COOKIE TAB */}
        {activeTab === "cookies" && (
          <div>
            {/* Intro Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-7 mb-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold to-navy rounded-l" />
              <h3 className="text-lg font-bold text-navy mb-3">
                {ct.introTitle}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {ct.introText}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {ct.updated}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {ct.lawReference}
                </div>
              </div>
            </div>

            <AccordionItem icon="1" title={ct.sections.whatAreCookies.title} isOpen={openItem === "c1"} onClick={() => toggle("c1")}>
              <p>{ct.sections.whatAreCookies.text1}</p>
              <p>{ct.sections.whatAreCookies.text2}</p>
            </AccordionItem>

            <AccordionItem icon="2" title={ct.sections.whichCookies.title} isOpen={openItem === "c2"} onClick={() => toggle("c2")}>
              <p>{ct.sections.whichCookies.intro}</p>
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse rounded-lg overflow-hidden border border-gray-200">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{ct.sections.whichCookies.tableHeaders.cookie}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{ct.sections.whichCookies.tableHeaders.purpose}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{ct.sections.whichCookies.tableHeaders.duration}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{ct.sections.whichCookies.tableHeaders.type}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ct.sections.whichCookies.cookies.map((cookie: { name: string; purpose: string; duration: string; type: string }, i: number) => (
                      <tr key={cookie.name} className={i % 2 === 1 ? "bg-gray-50/50" : "border-b border-gray-100"}>
                        <td className="px-4 py-3 font-mono text-xs">{cookie.name}</td>
                        <td className="px-4 py-3">{cookie.purpose}</td>
                        <td className="px-4 py-3">{cookie.duration}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{cookie.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <HighlightBox title={ct.sections.whichCookies.noAnalyticsTitle}>
                <span className="text-gray-600">{ct.sections.whichCookies.noAnalyticsText}</span>
              </HighlightBox>
            </AccordionItem>

            <AccordionItem icon="3" title={ct.sections.legalBasis.title} isOpen={openItem === "c3"} onClick={() => toggle("c3")}>
              <p>{ct.sections.legalBasis.text1}</p>
              <p>{ct.sections.legalBasis.text2}</p>
              <p>{ct.sections.legalBasis.text3}</p>
            </AccordionItem>

            <AccordionItem icon="4" title={ct.sections.manageCookies.title} isOpen={openItem === "c4"} onClick={() => toggle("c4")}>
              <p>{ct.sections.manageCookies.intro}</p>
              <ul className="list-none space-y-1.5 ml-0">
                {ct.sections.manageCookies.browsers.map((browser: { name: string; path: string }) => (
                  <li key={browser.name} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                    <strong className="text-navy">{browser.name}:</strong> {browser.path}
                  </li>
                ))}
              </ul>
              <p><strong className="text-navy">{ct.sections.manageCookies.warning.split(":")[0]}:</strong>{ct.sections.manageCookies.warning.substring(ct.sections.manageCookies.warning.indexOf(":") + 1)}</p>
            </AccordionItem>
          </div>
        )}

        {/* CONTACT FOOTER */}
        <div className="bg-navy text-white rounded-xl p-8 mt-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-[80px]" />
          <h3 className="text-xl font-bold mb-2 relative">
            {dict.contactFooter.title}
          </h3>
          <p className="text-white/70 text-sm mb-5 relative">
            {dict.contactFooter.text}
          </p>
          <div className="flex flex-wrap justify-center gap-3 relative">
            <a
              href={`mailto:${OFFICE.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 rounded-full text-white text-sm font-medium hover:bg-gold/20 hover:border-gold/40 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {OFFICE.email}
            </a>
            <a
              href={`tel:${OFFICE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 rounded-full text-white text-sm font-medium hover:bg-gold/20 hover:border-gold/40 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {OFFICE.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
