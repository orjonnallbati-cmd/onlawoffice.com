import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import AboutPreview from "@/components/home/AboutPreview";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati | Tiranë",
  description:
    "Studio Ligjore profesionale në Tiranë. Avokat Orjon Nallbati — shërbime juridike në të drejtën civile, tregtare, administrative, kushtetuese dhe mbrojtjen e të dhënave personale (DPO).",
  keywords: [
    "avokat tirane",
    "studio ligjore tirane",
    "avokat shqiperi",
    "OnLaw Office",
    "Orjon Nallbati",
    "sherbime juridike",
    "avokat",
    "DPO",
    "mbrojtje te dhenash",
    "e drejte civile",
    "e drejte tregtare",
    "ligji 124/2024",
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <AboutPreview />
      <CTABanner />
    </>
  );
}
