import Link from 'next/link';
import RegisterForm from './RegisterForm';

// Lexohet në çdo kërkesë: sapo REGISTRATION_CODE vendoset (ose hiqet) në
// Vercel, faqja e ndjek pa pasur nevojë për build të ri.
export const dynamic = 'force-dynamic';

const CLOSED = {
  sq: { title: 'Regjistrimi është i mbyllur', text: 'Platforma është e brendshme për stafin e OnLaw Office. Llogaritë hapen vetëm nga administratori i studios.', login: 'Hyni në llogari', home: 'Kthehu te faqja kryesore' },
  en: { title: 'Registration is closed', text: 'This platform is internal to OnLaw Office staff. Accounts are opened only by the firm administrator.', login: 'Sign in', home: 'Back to the website' },
  it: { title: 'La registrazione è chiusa', text: "La piattaforma è riservata allo staff di OnLaw Office. Gli account vengono aperti solo dall'amministratore dello studio.", login: 'Accedi', home: 'Torna al sito' },
} as const;
type Lang = keyof typeof CLOSED;

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.REGISTRATION_CODE) return <RegisterForm />;

  const { locale } = await params;
  const lang = (locale in CLOSED ? locale : 'sq') as Lang;
  const t = CLOSED[lang];
  const prefix = lang === 'sq' ? '' : `/${lang}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="w-full max-w-lg px-4">
        <div className="border border-gray-700/50 bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-white">{t.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-300">{t.text}</p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <Link href={`${prefix}/app/login`} className="text-blue-400 hover:text-blue-300">{t.login}</Link>
            <Link href={prefix || '/'} className="text-gray-400 hover:text-gray-200">{t.home}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
