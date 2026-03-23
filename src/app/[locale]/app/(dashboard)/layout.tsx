import AppSidebar from '@/components/app/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}
