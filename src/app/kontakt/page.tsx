import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { OFFICE } from "@/lib/constants";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Na Kontaktoni",
  description:
    "Na kontaktoni për konsultë juridike. OnLaw Office — Blv. Gjergj Fishta, Tiranë. Tel: +355 69 331 4640.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHeader
        title="Na Kontaktoni"
        subtitle="Jemi këtu për t'ju ndihmuar me çdo çështje juridike"
      />

      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-navy mb-2">
                Dërgoni një Mesazh
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Plotësoni formularin dhe do t&apos;ju kontaktojmë brenda 24
                orëve.
              </p>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-alt rounded-xl p-8">
                <h2 className="text-xl font-bold text-navy mb-6">
                  Informacione Kontakti
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">Adresa</p>
                      <p className="text-gray-500 text-sm">{OFFICE.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                      <PhoneIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">Telefon</p>
                      <a
                        href={`tel:${OFFICE.phone}`}
                        className="text-gray-500 hover:text-navy text-sm"
                      >
                        {OFFICE.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                      <EnvelopeIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">Email</p>
                      <a
                        href={`mailto:${OFFICE.email}`}
                        className="text-gray-500 hover:text-navy text-sm"
                      >
                        {OFFICE.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                      <ClockIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">
                        Orari i Punës
                      </p>
                      <p className="text-gray-500 text-sm">
                        E Hënë - E Premte: 09:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    NUIS: {OFFICE.nuis} | Lic. {OFFICE.license}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {OFFICE.chamber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="h-80 lg:h-96 bg-gray-200">
        <iframe
          title="OnLaw Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.0!2d19.8!3d41.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzQ4LjAiTiAxOcKwNDgnMDAuMCJF!5e0!3m2!1ssq!2sal!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
