import AdminSidebar from '@/components/AdminSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        <div className="px-6 pt-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
