import type { Metadata } from "next";

/**
 * Layout for the dashboard / app section (login, register, dashboard, cases,
 * clients, etc.). These pages are private and should never be indexed by
 * search engines — Google would otherwise waste crawl budget on auth-walled
 * pages and report them as "Scanned but not indexed".
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
