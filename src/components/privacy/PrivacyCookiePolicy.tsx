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
export default function PrivacyCookiePolicy() {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies">("privacy");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <>
      {/* ═══ HERO ═══ */}
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
            Ligji Nr. 124/2024
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Politika e Privatesise
            <br />
            <span className="text-gold">&amp; Cookie Policy</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Si i mbrojme te dhenat tuaja personale — OnLaw Office, Studio
            Ligjore e Av. Orjon Nallbati
          </p>
        </div>
      </section>

      {/* ═══ TABS ═══ */}
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
          Politika e Privatesise
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
          Cookie Policy
        </button>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-3xl mx-auto px-6 py-10 pb-20">
        {/* ───── PRIVACY TAB ───── */}
        {activeTab === "privacy" && (
          <div>
            {/* Intro Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-7 mb-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold to-navy rounded-l" />
              <h3 className="text-lg font-bold text-navy mb-3">
                Informacion mbi mbrojtjen e te dhenave personale
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kjo politike privatësie shpjegon se si OnLaw Office mbledh,
                perdor dhe mbron te dhenat tuaja personale kur vizitoni faqen
                tone te internetit{" "}
                <strong className="text-navy">onlawoffice.com</strong> ose na
                kontaktoni nepermjet saj, ne perputhje me Ligjin Nr. 124/2024
                &quot;Per mbrojtjen e te dhenave personale&quot;.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 text-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Perditesuar: Mars 2026
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 text-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Ligji 124/2024, Neni 13
                </div>
              </div>
            </div>

            {/* Accordion Items */}
            <AccordionItem
              icon="1"
              title="Kush jemi ne? (Kontrolluesi i te dhenave)"
              isOpen={openItem === "p1"}
              onClick={() => toggle("p1")}
            >
              <p>Kontrolluesi i te dhenave personale eshte:</p>
              <HighlightBox title="OnLaw Office — Studio Ligjore">
                <span className="text-gray-600">
                  {OFFICE.lawyer}
                  <br />
                  NUIS: {OFFICE.nuis}
                  <br />
                  Adresa: {OFFICE.address}
                  <br />
                  Email:{" "}
                  <a
                    href={`mailto:${OFFICE.email}`}
                    className="text-navy hover:text-gold transition-colors"
                  >
                    {OFFICE.email}
                  </a>
                  <br />
                  Tel:{" "}
                  <a
                    href={`tel:${OFFICE.phone.replace(/\s/g, "")}`}
                    className="text-navy hover:text-gold transition-colors"
                  >
                    {OFFICE.phone}
                  </a>
                </span>
              </HighlightBox>
              <p>
                Per cdo pyetje ne lidhje me perpunimin e te dhenave tuaja
                personale, mund te na kontaktoni ne adresen e emailit te
                mesiperm.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="2"
              title="Cfare te dhenash mbledhim?"
              isOpen={openItem === "p2"}
              onClick={() => toggle("p2")}
            >
              <p>
                Kur perdorni faqen tone te internetit, mund te mbledhim keto
                kategori te dhenash:
              </p>
              <p>
                <strong className="text-navy">
                  a) Te dhena nga formulari i kontaktit:
                </strong>
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Emri i plote
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Adresa e emailit
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Numri i telefonit (opsionale)
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Subjekti dhe permbajtja e mesazhit
                </li>
              </ul>
              <p>
                <strong className="text-navy">
                  b) Te dhena teknike (automatike):
                </strong>
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Adresa IP (per sigurine teknike)
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Lloji i shfletuesit (browser) dhe pajisjes
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  Data dhe ora e vizites
                </li>
              </ul>
              <p>
                Nuk mbledhim te dhena sensitive (si p.sh. te dhena
                shendetesore, fetare, biometrike) nepermjet faqes sone.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="3"
              title="Pse i perpunojme dhe mbi cfare baze ligjore?"
              isOpen={openItem === "p3"}
              onClick={() => toggle("p3")}
            >
              <p>
                Te dhenat tuaja perpunohen per qellimet e meposhtme:
              </p>
              <HighlightBox title="Pergjigja ndaj kerkeses suaj (Formulari i kontaktit)">
                <span className="text-gray-600">
                  Baza ligjore: Masat paraprake me kerkese tuajen per te lidhur
                  nje marredhenie kontraktore, ose pelqimi juaj (Neni 7,
                  shkronja &quot;b&quot; dhe &quot;a&quot;, Ligji 124/2024).
                </span>
              </HighlightBox>
              <HighlightBox title="Funksionimi teknik i faqes">
                <span className="text-gray-600">
                  Baza ligjore: Interesi i ligjshem i kontrolluesit per
                  sigurimin e funksionimit teknik te faqes (Neni 7, shkronja
                  &quot;dh&quot;, Ligji 124/2024).
                </span>
              </HighlightBox>
              <HighlightBox title="Permbushja e detyrimeve ligjore">
                <span className="text-gray-600">
                  Baza ligjore: Detyrimi ligjor i kontrolluesit (Neni 7,
                  shkronja &quot;c&quot;, Ligji 124/2024), si p.sh. ruajtja e
                  dokumentacionit sipas legjislacionit fiskal ose arkivor.
                </span>
              </HighlightBox>
            </AccordionItem>

            <AccordionItem
              icon="4"
              title="Sa kohe i ruajme te dhenat?"
              isOpen={openItem === "p4"}
              onClick={() => toggle("p4")}
            >
              <p>
                Zbatojme parimin e kufizimit te periudhes se ruajtjes sipas
                Nenit 6, pika 1, shkronja &quot;dh&quot; te Ligjit 124/2024:
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Te dhena kontakti:</strong>{" "}
                  Ruhen deri ne perfundimin e komunikimit me ju dhe jo me gjate
                  se 12 muaj nga kontakti i fundit, pervecse kur krijohet nje
                  marredhenie kontraktore.
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    Te dhena teknike (log):
                  </strong>{" "}
                  Ruhen deri ne 90 dite, vetem per qellime sigurie teknike.
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    Dokumentacion ligjor/kontraktual:
                  </strong>{" "}
                  Ruhen sipas afateve ligjore ne fuqi (deri ne 10 vjet sipas
                  legjislacionit fiskal).
                </li>
              </ul>
              <p>
                Pas perfundimit te afatit, te dhenat fshihen ose anonimizohen.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="5"
              title="Me ke ndahen te dhenat?"
              isOpen={openItem === "p5"}
              onClick={() => toggle("p5")}
            >
              <p>
                Te dhenat tuaja personale nuk shiten, nuk tregtohen dhe nuk
                ndahen me pale te treta per qellime marketingu.
              </p>
              <p>Ato mund t&apos;u vihen ne dispozicion vetem:</p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    Ofruesve te sherbimit teknik
                  </strong>{" "}
                  (hosting, email) — qe veprojne si perpunues te dhenash sipas
                  udhezimeve tona dhe me garancite perkatese kontraktore;
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Autoriteteve publike</strong> —
                  vetem kur kerkohet me ligj ose me urdher gjykate.
                </li>
              </ul>
              <p>
                Formulari i kontaktit funksionon nepermjet sherbimit te dergimit
                me email. Te dhenat e derguara nepermjet formularit dergohen
                drejtperdrejt ne emailin tone profesional dhe nuk ruhen ne baza
                te dhenash te jashtme.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="6"
              title="A transferohen te dhenat jashte Shqiperise?"
              isOpen={openItem === "p6"}
              onClick={() => toggle("p6")}
            >
              <p>
                Si rregull, te dhenat tuaja perpunohen brenda territorit te
                Republikes se Shqiperise ose ne vende qe ofrojne nivel adekuat
                mbrojtjeje.
              </p>
              <p>
                Nese per arsye teknike (si p.sh. infrastruktura e sherbimit te
                emailit) te dhenat transferohen ne nje vend tjeter, ne
                sigurohemi qe transferimi te mbeshetet ne garanci te
                pershtatshme sipas Pjeses II, Kapitulli V (Nenet 37-44) te
                Ligjit 124/2024, duke perfshire klauza standarde kontraktore ose
                vendime pershtatshmerie.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="7"
              title="Cilat jane te drejtat tuaja?"
              isOpen={openItem === "p7"}
              onClick={() => toggle("p7")}
            >
              <p>
                Sipas Neneve 13-20 te Ligjit 124/2024, ju gezoni keto te
                drejta:
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    E drejta per informim
                  </strong>{" "}
                  (Neni 13) — te informoheni mbi perpunimin e te dhenave
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">E drejta e aksesit</strong>{" "}
                  (Neni 14) — te merrni nje kopje te te dhenave tuaja
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    E drejta per korrigjim
                  </strong>{" "}
                  (Neni 15) — te korrigjoni te dhena te pasakta
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">E drejta per fshirje</strong>{" "}
                  (Neni 15) — te kerkoni fshirjen e te dhenave
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">E drejta per kufizim</strong>{" "}
                  (Neni 16) — te kufizoni perpunimin
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    E drejta per transferueshmeri
                  </strong>{" "}
                  (Neni 18) — te merrni te dhenat ne format elektronik
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    E drejta per te kundershtuar
                  </strong>{" "}
                  (Neni 19) — te kundershtoni perpunimin
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">
                    E drejta per terheqjen e pelqimit
                  </strong>{" "}
                  — ne cdo kohe, pa ndikuar ligjshmerine e perpunimit te
                  meparshem
                </li>
              </ul>
              <HighlightBox title="Si t'i ushtroni?">
                <span className="text-gray-600">
                  Dergoni kerkesen tuaj me email ne{" "}
                  <a
                    href={`mailto:${OFFICE.email}`}
                    className="text-navy hover:text-gold transition-colors font-medium"
                  >
                    {OFFICE.email}
                  </a>
                  . Do t&apos;ju pergjigjemi brenda 30 diteve.
                </span>
              </HighlightBox>
            </AccordionItem>

            <AccordionItem
              icon="8"
              title="E drejta per ankese te Komisioneri"
              isOpen={openItem === "p8"}
              onClick={() => toggle("p8")}
            >
              <p>
                Nese konsideroni se te drejtat tuaja te mbrojtjes se te dhenave
                personale jane cenuar, keni te drejte te paraqisni ankese prane:
              </p>
              <HighlightBox title="Komisioneri per te Drejten e Informimit dhe Mbrojtjen e te Dhenave Personale">
                <span className="text-gray-600">
                  Adresa: Rruga &quot;Abdi Toptani&quot;, Nd. 5, Tirane
                  <br />
                  Tel: +355 42 237 200
                  <br />
                  Web:{" "}
                  <a
                    href="https://www.idp.al"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy hover:text-gold transition-colors font-medium"
                  >
                    www.idp.al
                  </a>
                  <br />
                  Email: info@idp.al
                </span>
              </HighlightBox>
              <p>
                Gjithashtu, sipas Nenit 88 te Ligjit 124/2024, keni te drejte
                per mjet juridik efektiv prane gjykates kompetente.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="9"
              title="A merren vendime automatike?"
              isOpen={openItem === "p9"}
              onClick={() => toggle("p9")}
            >
              <p>
                Jo. OnLaw Office nuk perdor asnje sistem vendimmarrjeje
                automatike ose profilizimi sipas Nenit 20 te Ligjit 124/2024 ne
                lidhje me vizitoret e faqes ose klientet.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="10"
              title="Ndryshimet e kesaj politike"
              isOpen={openItem === "p10"}
              onClick={() => toggle("p10")}
            >
              <p>
                Kjo politike mund te perditësohet here pas here per te pasqyruar
                ndryshime ligjore ose te praktikes sone. Versioni i perditesuar
                do te publikohet ne kete faqe me daten e perditesimit. Ju
                inkurajojme ta rishikoni periodikisht.
              </p>
              <p>
                <strong className="text-navy">Versioni aktual:</strong> Mars
                2026
              </p>
            </AccordionItem>
          </div>
        )}

        {/* ───── COOKIE TAB ───── */}
        {activeTab === "cookies" && (
          <div>
            {/* Intro Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-7 mb-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold to-navy rounded-l" />
              <h3 className="text-lg font-bold text-navy mb-3">
                Politika e Cookies (Skedareve te Perkohshem)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kjo politike shpjegon se si faqja{" "}
                <strong className="text-navy">onlawoffice.com</strong> perdor
                cookies — skedare te vegjel teksti qe ruhen ne pajisjen tuaj kur
                vizitoni faqen tone.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 text-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Perditesuar: Mars 2026
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 text-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Ligji 124/2024
                </div>
              </div>
            </div>

            <AccordionItem
              icon="1"
              title="Cfare jane cookies?"
              isOpen={openItem === "c1"}
              onClick={() => toggle("c1")}
            >
              <p>
                Cookies jane skedare te vegjel teksti qe faqet e internetit
                ruajne ne pajisjen tuaj (kompjuter, telefon, tablet). Ato
                ndihmojne faqen te funksionoje sic duhet, te ruaje preferencat
                tuaja dhe te ofroje nje pervoje me te mire navigimi.
              </p>
              <p>
                Cookies nuk permbajne viruse dhe nuk mund te aksesojne
                informacione te tjera ne pajisjen tuaj.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="2"
              title="Cilat cookies perdorim?"
              isOpen={openItem === "c2"}
              onClick={() => toggle("c2")}
            >
              <p>
                Faqja onlawoffice.com perdor{" "}
                <strong className="text-navy">
                  vetem cookies teknike (te domosdoshme)
                </strong>{" "}
                per funksionimin e faqes. Nuk perdorim cookies analitike,
                marketingu ose profilizimi.
              </p>
              {/* Cookie Table */}
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse rounded-lg overflow-hidden border border-gray-200">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Cookie
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Qellimi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Kohezgjatja
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Lloji
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-mono text-xs">
                        session_id
                      </td>
                      <td className="px-4 py-3">
                        Menaxhimi i sesionit te navigimit
                      </td>
                      <td className="px-4 py-3">
                        Deri ne mbylljen e shfletuesit
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          I domosdoshem
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs">
                        csrf_token
                      </td>
                      <td className="px-4 py-3">
                        Mbrojtja e formularit nga sulme
                      </td>
                      <td className="px-4 py-3">
                        Deri ne mbylljen e shfletuesit
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          I domosdoshem
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <HighlightBox title="Pa cookies analitike ose marketingu">
                <span className="text-gray-600">
                  Nuk perdorim Google Analytics, Facebook Pixel ose ndonje mjet
                  tjeter gjurmimi. Navigimi juaj ne faqen tone nuk gjurmohet per
                  qellime profilizimi ose reklamimi.
                </span>
              </HighlightBox>
            </AccordionItem>

            <AccordionItem
              icon="3"
              title="Baza ligjore e cookies"
              isOpen={openItem === "c3"}
              onClick={() => toggle("c3")}
            >
              <p>
                Cookies teknike (te domosdoshme) nuk kerkojne pelqimin tuaj,
                pasi jane te nevojshme per funksionimin baze te faqes.
              </p>
              <p>
                Baza ligjore: Interesi i ligjshem i kontrolluesit (Neni 7,
                shkronja &quot;dh&quot;, Ligji 124/2024) per sigurimin e
                funksionimit teknik dhe sigurise se faqes.
              </p>
              <p>
                Nese ne te ardhmen vendosim te perdorim cookies analitike ose
                marketingu, do te perditesojme kete politike dhe do te kerkojme
                pelqimin tuaj te shprehur perpara aktivizimit te tyre.
              </p>
            </AccordionItem>

            <AccordionItem
              icon="4"
              title="Si t'i menaxhoni cookies?"
              isOpen={openItem === "c4"}
              onClick={() => toggle("c4")}
            >
              <p>
                Ju mund t&apos;i menaxhoni ose fshini cookies nepermjet
                cilesimeve te shfletuesit tuaj:
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Chrome:</strong> Settings →
                  Privacy and Security → Cookies
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Firefox:</strong> Settings →
                  Privacy &amp; Security → Cookies
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Safari:</strong> Preferences →
                  Privacy → Cookies
                </li>
                <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.55rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold">
                  <strong className="text-navy">Edge:</strong> Settings →
                  Privacy → Cookies
                </li>
              </ul>
              <p>
                <strong className="text-navy">Kujdes:</strong> Caktivizimi i
                cookies teknike mund te ndikoje funksionimin e faqes, si p.sh.
                mundesine e perdorimit te formularit te kontaktit.
              </p>
            </AccordionItem>
          </div>
        )}

        {/* ═══ CONTACT FOOTER ═══ */}
        <div className="bg-navy text-white rounded-xl p-8 mt-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-[80px]" />
          <h3 className="text-xl font-bold mb-2 relative">
            Keni pyetje per te dhenat tuaja?
          </h3>
          <p className="text-white/70 text-sm mb-5 relative">
            Na kontaktoni per cdo ceshtje qe lidhet me privatesine dhe mbrojtjen
            e te dhenave personale.
          </p>
          <div className="flex flex-wrap justify-center gap-3 relative">
            <a
              href={`mailto:${OFFICE.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 rounded-full text-white text-sm font-medium hover:bg-gold/20 hover:border-gold/40 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {OFFICE.email}
            </a>
            <a
              href={`tel:${OFFICE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 rounded-full text-white text-sm font-medium hover:bg-gold/20 hover:border-gold/40 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
