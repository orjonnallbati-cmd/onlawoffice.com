import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

/**
 * Entiteti i vetëm "Av. Orjon Nallbati" për schema.org dhe për motorët e AI-së.
 * Përdoret në layout (founder), te faqja "Rreth nesh" (ProfilePage) dhe te
 * artikujt e blogut (author), gjithmonë me të njëjtin @id.
 */
export const SITE = "https://www.onlawoffice.com";
export const PERSON_ID = `${SITE}/#orjon-nallbati`;
export const ORG_ID = `${SITE}/#organization`;

export const PROFILES = {
  linkedin: "https://www.linkedin.com/in/orjon-nallbati-4889b7293/",
  facebook: "https://www.facebook.com/orjon.nallbati",
  x: "https://x.com/orionnallbati",
  itaka7: "https://itaka7.com",
  googleMaps: "https://maps.app.goo.gl/x4i5Z3txxadj7GGPA",
} as const;

export const ITAKA7_ORG = {
  "@type": "Organization",
  "@id": "https://itaka7.com/#organization",
  name: "ITAKA7",
  legalName: "ITAKA7 sh.p.k.",
  url: PROFILES.itaka7,
  description:
    "Privacy, data protection (GDPR, Albanian Law 124/2024) and cybersecurity consulting, Tirana, Albania.",
  address: { "@type": "PostalAddress", addressLocality: "Tiranë", addressCountry: "AL" },
  founder: { "@id": PERSON_ID },
};

const JOB_TITLES: Record<Locale, string[]> = {
  sq: ["Avokat", "Përgjegjës për Mbrojtjen e të Dhënave (DPO)"],
  it: ["Avvocato", "Data Protection Officer (DPO)"],
  en: ["Lawyer", "Data Protection Officer (DPO)"],
};

const DESCRIPTIONS: Record<Locale, string> = {
  sq: "Avokat në Tiranë që nga viti 2013 (OnLaw Office), Përgjegjës për Mbrojtjen e të Dhënave (DPO) për shoqëri shqiptare dhe italiane që nga viti 2014 dhe bashkëthemelues i ITAKA7, shoqëri e specializuar në privacy dhe mbrojtje të dhënash. Formim juridik në Università degli Studi di Camerino (Itali). Fusha: e drejta civile dhe e pronësisë, e drejta tregtare, administrative dhe kushtetuese, GDPR dhe Ligji 124/2024. Punon në shqip, italisht dhe anglisht.",
  it: "Avvocato a Tirana dal 2013 (OnLaw Office), Data Protection Officer (DPO) per società albanesi e italiane dal 2014 e co-fondatore di ITAKA7, società specializzata in privacy e protezione dei dati. Formazione giuridica all'Università degli Studi di Camerino. Aree: diritto civile e immobiliare, commerciale, amministrativo e costituzionale, GDPR e legge albanese 124/2024. Lavora in albanese, italiano e inglese.",
  en: "Lawyer in Tirana since 2013 (OnLaw Office), Data Protection Officer (DPO) for Albanian and Italian companies since 2014 and co-founder of ITAKA7, a privacy and data protection consultancy. Law degrees from the University of Camerino (Italy). Practice areas: civil and property law, commercial, administrative and constitutional law, GDPR and Albanian Law 124/2024. Works in Albanian, Italian and English.",
};

const KNOWS_ABOUT = [
  "E drejta civile",
  "E drejta e pronësisë dhe pasuritë e paluajtshme",
  "E drejta tregtare",
  "E drejta administrative",
  "E drejta kushtetuese",
  "Mbrojtja e të dhënave personale",
  "GDPR",
  "Ligji 124/2024 për mbrojtjen e të dhënave personale",
  "Data Protection Officer (DPO)",
  "Kontrata ndërkombëtare",
  "Diritto civile italiano",
];

export function personJsonLd(lang: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Orjon Nallbati",
    alternateName: ["Av. Orjon Nallbati", "Avv. Orjon Nallbati"],
    honorificPrefix: lang === "it" ? "Avv." : "Av.",
    givenName: "Orjon",
    familyName: "Nallbati",
    jobTitle: JOB_TITLES[lang],
    description: DESCRIPTIONS[lang],
    url: `${SITE}${getLocalizedPath(lang, "about")}`,
    image: `${SITE}/images/orjon-nallbati.jpg`,
    email: OFFICE.email,
    telephone: "+355693314640",
    worksFor: [
      { "@type": "LegalService", "@id": ORG_ID, name: OFFICE.name, url: SITE },
      ITAKA7_ORG,
    ],
    affiliation: [{ "@id": ORG_ID }, { "@id": ITAKA7_ORG["@id"] }],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Università degli Studi di Camerino",
      sameAs: "https://www.unicam.it/",
    },
    memberOf: { "@type": "Organization", name: "Dhoma e Avokatisë Tiranë" },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Licencë avokati nr. 6656",
        recognizedBy: { "@type": "Organization", name: "Dhoma Kombëtare e Avokatisë së Shqipërisë" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Laurea magistrale in Giurisprudenza",
        recognizedBy: { "@type": "CollegeOrUniversity", name: "Università degli Studi di Camerino" },
      },
    ],
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ["sq", "it", "en"],
    nationality: { "@type": "Country", name: "Albania" },
    address: {
      "@type": "PostalAddress",
      streetAddress: 'Blv. "Gjergj Fishta", Pall. TeknoProjekt, Kulla III, Ap. 9',
      addressLocality: "Tiranë",
      postalCode: "1001",
      addressCountry: "AL",
    },
    sameAs: [PROFILES.linkedin, PROFILES.facebook, PROFILES.x, PROFILES.itaka7, PROFILES.googleMaps],
  };
}

/** Autori i artikujve: referencë e shkurtër te i njëjti entitet. */
export function authorJsonLd(lang: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Av. Orjon Nallbati",
    jobTitle: JOB_TITLES[lang],
    url: `${SITE}${getLocalizedPath(lang, "about")}`,
    image: `${SITE}/images/orjon-nallbati.jpg`,
    sameAs: [PROFILES.linkedin, PROFILES.itaka7],
  };
}
