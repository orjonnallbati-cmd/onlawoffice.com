import Link from "next/link";
import { OFFICE, NAV_LINKS } from "@/lib/constants";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      {/* Gold line */}
      <div className="h-1 bg-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">OnLaw Office</h3>
            <p className="text-gold text-sm mb-4">{OFFICE.full}</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Studio ligjore profesionale me përvojë në fushën e së drejtës
              civile, tregtare, administrative, kushtetuese dhe mbrojtjen e të
              dhënave personale.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Lidhje të Shpejta
            </h3>
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{OFFICE.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gold shrink-0" />
                <a
                  href={`tel:${OFFICE.phone}`}
                  className="text-gray-300 hover:text-gold transition-colors text-sm"
                >
                  {OFFICE.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-gold shrink-0" />
                <a
                  href={`mailto:${OFFICE.email}`}
                  className="text-gray-300 hover:text-gold transition-colors text-sm"
                >
                  {OFFICE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <p>
              &copy; {currentYear} {OFFICE.name}. Të gjitha të drejtat e
              rezervuara.
            </p>
            <p>
              NUIS: {OFFICE.nuis} | Lic. {OFFICE.license}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
