import type { Metadata } from "next";
import PrivacyCookiePolicy from "@/components/privacy/PrivacyCookiePolicy";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.privacy.title,
    description: dict.metadata.privacy.description,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);

  return <PrivacyCookiePolicy dict={dict.privacy} />;
}
