import Link from "next/link";
import Logo from "@/components/layout/Logo";

/**
 * 404 në rrënjë: kapet për çdo adresë që nuk përputhet me asnjë rrugë
 * (edhe pas rishkrimit të middleware-it), kur `[locale]/not-found.tsx`
 * nuk arrihet. Pa Header/Footer — layout-i i rrënjës nuk i ka.
 */
export default function RootNotFound() {
  return (
    <main className="min-h-screen bg-navy text-white flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl">
          <Link href="/" className="inline-block text-white" aria-label="OnLaw Office">
            <Logo className="block h-11 w-auto" green="#2E9E6F" />
          </Link>
          <p className="mt-16 font-display text-gold-300 text-7xl leading-none">404</p>
          <h1 className="mt-6 text-3xl sm:text-4xl leading-tight">
            Faqja nuk u gjet · Page not found · Pagina non trovata
          </h1>
          <p className="mt-6 text-gray-300 leading-relaxed">
            Adresa nuk ekziston ose është zhvendosur. — The address does not exist or has moved. — L&apos;indirizzo non esiste o è stato spostato.
          </p>
          <Link
            href="/"
            className="mt-10 inline-block px-8 py-4 bg-white text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-gray-200 transition-colors"
          >
            www.onlawoffice.com
          </Link>
        </div>
      </div>
    </main>
  );
}
