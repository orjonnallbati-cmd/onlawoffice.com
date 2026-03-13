import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-navy min-h-screen flex items-center pt-20">
      <Container className="text-center">
        <p className="text-gold text-6xl font-bold mb-4">404</p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Faqja Nuk u Gjet
        </h1>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Faqja që po kërkoni nuk ekziston ose mund të jetë zhvendosur.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 bg-gold text-navy font-semibold rounded-md hover:bg-gold-300 transition-colors"
        >
          Kthehu në Kryefaqje
        </Link>
      </Container>
    </section>
  );
}
