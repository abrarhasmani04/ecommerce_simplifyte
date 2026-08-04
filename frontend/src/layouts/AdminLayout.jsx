import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../features/admin/components/AdminSidebar";
import AdminNavbar from "../features/admin/components/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100">

      <AdminSidebar isOpen={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
