import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Formulari i kontaktit kalon këtu, jo direkt te Formspree. Kështu ID-ja e
 * formularit nuk shfaqet më në HTML (robotët e lexonin dhe postonin direkt
 * te formspree.io, duke anashkaluar honeypot-in që kontrollohej vetëm në
 * shfletues) dhe filtrat zbatohen në server, ku robotët nuk i shmangin dot.
 *
 * Mesazhet që klasifikohen si spam kthejnë 200 si të ishin dërguar, që
 * roboti të mos mësojë çfarë e bllokoi; arsyeja shkruhet në log-un e Vercel.
 */
const FORM_ID = process.env.FORMSPREE_FORM_ID || "xreylerv";
const MIN_FILL_MS = 3_000; // më shpejt se kaq nuk e plotëson dot një njeri
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_LEN = 5_000;

// Lidhje në mesazh: http(s)://, www. ose domain i zhveshur (jo pjesë e një emaili)
const LINK_RE =
  /https?:\/\/|www\.|(?<![@\w.-])[a-z0-9-]+\.(?:com|net|org|io|co|shop|store|xyz|ru|cn|info|biz|me|online|site|top|club|link|pro|vip)\b/i;

const SPAM_PHRASES = [
  "wholesale",
  "shop now",
  "free shipping",
  "% off",
  "discount code",
  "promo code",
  "backlink",
  "seo service",
  "guest post",
  "sponsored post",
  "crypto",
  "bitcoin",
  "casino",
  "viagra",
  "cialis",
  "loan offer",
  "make money",
  "earn $",
  "click here",
  "unsubscribe",
  "increase your traffic",
  "rank your website",
  "web design services",
  "boost your sales",
];

function field(data: FormData, name: string) {
  const v = data.get(name);
  return typeof v === "string" ? v.trim().slice(0, MAX_LEN) : "";
}

function spamReason(f: Record<string, string>): string | null {
  if (f._gotcha) return "honeypot";

  const t = Number(f._t);
  if (!t) return "pa kohë plotësimi (post direkt)";
  const age = Date.now() - t;
  if (age < MIN_FILL_MS) return `plotësuar në ${age} ms`;
  if (age > MAX_AGE_MS) return "formular i vjetër";

  const email = f.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "email i pavlefshëm";
  if (email.endsWith("@onlawoffice.com")) return "email me domain-in tonë";

  if (f.message.length < 10) return "mesazh bosh";

  const text = `${f.name}\n${f.subject}\n${f.message}`;
  if (LINK_RE.test(text)) return "lidhje në mesazh";

  const lower = text.toLowerCase();
  const hit = SPAM_PHRASES.find((p) => lower.includes(p));
  if (hit) return `frazë spam: "${hit}"`;

  return null;
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const f = {
    name: field(data, "name"),
    email: field(data, "email"),
    phone: field(data, "phone"),
    subject: field(data, "subject"),
    message: field(data, "message"),
    consent: field(data, "consent"),
    lang: field(data, "_lang") || "sq",
    _gotcha: field(data, "_gotcha"),
    _t: field(data, "_t"),
  };

  if (!f.name || !f.email || !f.message || !f.consent) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const reason = spamReason(f);
  if (reason) {
    console.warn(`[contact] spam i bllokuar (${reason}) nga ${ip}: ${f.email}`);
    // Për robotin duket si sukses
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name,
        email: f.email,
        phone: f.phone,
        subject: f.subject,
        message: f.message,
        consent: "on",
        language: f.lang,
        _replyto: f.email,
        _subject: `Kontakt nga faqja: ${f.name}${f.subject ? ` — ${f.subject}` : ""}`,
      }),
    });
    if (!res.ok) {
      console.error(`[contact] Formspree ktheu HTTP ${res.status}`);
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } catch (e) {
    console.error("[contact] Formspree i paarritshëm", e);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
