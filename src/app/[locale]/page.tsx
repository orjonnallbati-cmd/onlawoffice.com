import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import AboutPreview from "@/components/home/AboutPreview";
import CTABanner from "@/components/home/CTABanner";
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
    title: dict.metadata.home.title,
    description: dict.metadata.home.description,
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero dict={dict} locale={lang} />
      <ServicesOverview dict={dict} locale={lang} />
      <AboutPreview dict={dict} locale={lang} />
      <CTABanner dict={dict} locale={lang} />
    </>
  );
}
