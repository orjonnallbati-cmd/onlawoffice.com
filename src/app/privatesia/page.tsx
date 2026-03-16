import type { Metadata } from "next";
import PrivacyCookiePolicy from "@/components/privacy/PrivacyCookiePolicy";

export const metadata: Metadata = {
  title: "Politika e Privatësisë & Cookie Policy",
  description:
    "Si i mbrojmë të dhënat tuaja personale — OnLaw Office, Studio Ligjore e Av. Orjon Nallbati. Ligji Nr. 124/2024.",
};

export default function PrivacyPage() {
  return <PrivacyCookiePolicy />;
}
