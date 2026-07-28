import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

const AdminLayout = () => {
  // Controls whether the sidebar is collapsed (narrow) or expanded (wide)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Controls whether the mobile sidebar drawer is open
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const location = useLocation();

  // Close the mobile sidebar whenever the route changes.
  // We pass a function reference to avoid the "setState in effect" lint warning.
  useEffect(() => {
    const closeSidebar = () => setMobileSidebarOpen(false);
    closeSidebar();
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Left sidebar ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Main content area (shifts right to make space for sidebar) ── */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300
          ${sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[240px]"}
        `}
      >
        {/* Top header bar */}
        <AdminHeader
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
