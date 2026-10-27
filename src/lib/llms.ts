import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllPosts } from "@/lib/blog";
import { LOCALES, getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { SITE, PROFILES } from "@/lib/entity";

const LANG_NAME: Record<Locale, string> = { sq: "Shqip", it: "Italiano", en: "English" };

function header(): string {
  return `# OnLaw Office — Av. Orjon Nallbati

> Studio ligjore në Tiranë (Shqipëri) e avokatit Orjon Nallbati: e drejta civile dhe e pronësisë, e drejta tregtare, administrative dhe kushtetuese, mbrojtja e të dhënave personale (GDPR, Ligji 124/2024). Shërbime në shqip, italisht dhe anglisht.
> Law firm in Tirana, Albania, of lawyer Orjon Nallbati: civil and property law, commercial, administrative and constitutional law, personal data protection (GDPR, Albanian Law 124/2024). Services in Albanian, Italian and English.

## Who

- Av. Orjon Nallbati, avokat / lawyer in Tirana since 2013 (licence No. 6656, Tirana Bar Chamber; NUIS L41307017J).
- Data Protection Officer (DPO) for Albanian and Italian companies since 2014.
- Co-founder of ITAKA7 sh.p.k. (${PROFILES.itaka7}), privacy, data protection and cybersecurity consultancy, Tirana.
- Law degrees (laurea and laurea magistrale) from the Università degli Studi di Camerino, Italy (2001–2007). Author of two studies on Italian civil law (preliminary contract; presupposition).
- Representation before all Albanian courts, including the High Court and the Constitutional Court.
- Languages: Albanian (native), Italian (C2), English.

## Services

- Civil law and property / real estate (cadastre registration, ownership disputes, due diligence before purchase, foreign buyers).
- Commercial and corporate law (company formation, contracts, shareholder agreements, international outsourcing and NDA contracts in English).
- Administrative and constitutional law (appeals, public procurement, constitutional complaints).
- Personal data protection: GDPR and Albanian Law 124/2024 compliance, external DPO, DPIA, data processing agreements, proceedings before the Albanian Commissioner (Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale).
- Legal assistance in Italian for Italian companies and citizens operating in Albania.

## Contact

- Address: Blv. "Gjergj Fishta", Pall. TeknoProjekt, Kulla III, Ap. 9, 1001 Tiranë, Albania
- Phone: +355 69 331 4640
- Email: orjon.nallbati@onlawoffice.com
- Hours: Monday–Friday 09:00–17:00
- Google Maps: ${PROFILES.googleMaps}
- LinkedIn: ${PROFILES.linkedin}
`;
}

function pages(): string {
  const out: string[] = ["## Pages"];
  for (const locale of LOCALES) {
    const l = locale as Locale;
    out.push(`\n### ${LANG_NAME[l]}`);
    out.push(`- [Home](${SITE}${getLocalizedPath(l, "home")})`);
    out.push(`- [Services](${SITE}${getLocalizedPath(l, "services")})`);
    out.push(`- [About / profile of Av. Orjon Nallbati](${SITE}${getLocalizedPath(l, "about")})`);
    out.push(`- [Blog](${SITE}${getLocalizedPath(l, "blog")})`);
    out.push(`- [Contact](${SITE}${getLocalizedPath(l, "contact")})`);
  }
  return out.join("\n") + "\n";
}

function postList(): string {
  const out: string[] = ["## Blog articles"];
  for (const locale of LOCALES) {
    const l = locale as Locale;
    const blogPath = getLocalizedPath(l, "blog");
    out.push(`\n### ${LANG_NAME[l]}`);
    for (const p of getAllPosts(l)) {
      out.push(`- [${p.title}](${SITE}${blogPath}/${p.slug}) (${p.date}): ${p.excerpt}`);
    }
  }
  return out.join("\n") + "\n";
}

export function buildLlmsTxt(): string {
  return [header(), pages(), postList(), `## Optional\n\n- [Full text of all articles](${SITE}/llms-full.txt)\n`].join("\n");
}

export function buildLlmsFullTxt(): string {
  const parts: string[] = [header(), pages(), "## Articles (full text)\n"];
  const base = path.join(process.cwd(), "src/content/blog");
  for (const locale of LOCALES) {
    const l = locale as Locale;
    const blogPath = getLocalizedPath(l, "blog");
    for (const p of getAllPosts(l)) {
      const file = path.join(base, l, `${p.slug}.mdx`);
      if (!fs.existsSync(file)) continue;
      const { content } = matter(fs.readFileSync(file, "utf-8"));
      parts.push(`---\n\n# ${p.title}\n\nURL: ${SITE}${blogPath}/${p.slug}\nLanguage: ${l}\nDate: ${p.date}\nAuthor: Av. Orjon Nallbati\n\n${content.trim()}\n`);
    }
  }
  return parts.join("\n");
}
