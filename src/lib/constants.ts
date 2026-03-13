export const OFFICE = {
  name: "OnLaw Office",
  full: "Studio Ligjore — Av. Orjon Nallbati",
  lawyer: "Av. Orjon Nallbati",
  license: "Nr. 6656",
  nuis: "L41307017J",
  chamber: "Dhoma e Avokatisë Tiranë",
  address: 'Blv. "Gjergj Fishta", Pall. TeknoProjekt, Kulla III, Ap. 9, Tiranë',
  city: "Tiranë",
  phone: "+355 69 331 4640",
  email: "orjon.nallbati@onlawoffice.com",
  website: "www.onlawoffice.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Kryefaqja" },
  { href: "/sherbime", label: "Shërbimet" },
  { href: "/rreth-nesh", label: "Rreth Nesh" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const SERVICES = [
  {
    id: "civile",
    title: "E Drejta Civile",
    description:
      "Përfaqësim në çështje civile, pronësore, familjare, trashëgimore dhe detyrime.",
    details: [
      "Çështje pronësie dhe regjistrim pasurie",
      "E drejta familjare — divorc, kujdestari, birësim",
      "Trashëgimi dhe testament",
      "Detyrime kontraktore dhe jashtëkontraktore",
      "Ekzekutim i vendimeve gjyqësore",
    ],
  },
  {
    id: "tregtare",
    title: "E Drejta Tregtare",
    description:
      "Themelim shoqërish, kontrata tregtare, ristrukturime, falimentim dhe arbitrazh.",
    details: [
      "Themelim dhe ristrukturim shoqërish tregtare",
      "Kontrata tregtare dhe negociata",
      "Mbrojtja e interesave të ortakëve",
      "Procedura falimentimi",
      "Arbitrazh tregtar",
    ],
  },
  {
    id: "administrative",
    title: "E Drejta Administrative",
    description:
      "Ankime administrative, kundërshtim aktesh, përfaqësim pranë autoriteteve publike.",
    details: [
      "Kundërshtim i akteve administrative",
      "Ankime në gjykata administrative",
      "Procedura tenderimi dhe prokurime publike",
      "Përgjegjësia jashtëkontraktore e shtetit",
      "Leje dhe licenca",
    ],
  },
  {
    id: "kushtetuese",
    title: "E Drejta Kushtetuese",
    description:
      "Ankime individuale kushtetuese, çështje pranë Gjykatës Kushtetuese.",
    details: [
      "Ankime individuale kushtetuese",
      "Mbrojtja e të drejtave themelore",
      "Procese pranë Gjykatës Kushtetuese",
      "Çështje pranë GJEDNJ",
    ],
  },
  {
    id: "gdpr",
    title: "Mbrojtja e të Dhënave",
    description:
      "Përputhshmëria me Ligjin 124/2024, DPO i jashtëm, auditime privatësie, GDPR.",
    details: [
      "Përputhshmëri me Ligjin 124/2024 dhe GDPR",
      "DPO i jashtëm (Data Protection Officer)",
      "Auditime dhe vlerësime privatësie (DPIA)",
      "Hartim politikash dhe rregulloresh",
      "Trajnime për stafin",
    ],
  },
  {
    id: "kontrata",
    title: "Hartim Kontratash",
    description:
      "Kontrata pune, qiraje, shërbimi, SPA, NDA, dhe marrëveshje të ndryshme.",
    details: [
      "Kontrata pune dhe marrëdhënie punësimi",
      "Kontrata qiraje (rezidenciale dhe tregtare)",
      "Kontrata shërbimi profesional",
      "NDA, SPA, SLA dhe marrëveshje ndërkombëtare",
      "Prokura dhe autorizime",
    ],
  },
] as const;
