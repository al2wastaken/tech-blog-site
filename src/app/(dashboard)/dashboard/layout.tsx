"use client";

import AdminSidebar from '@/components/AdminSidebar';
import useRequireAdmin from '@/lib/useRequireAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useRequireAdmin();

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
