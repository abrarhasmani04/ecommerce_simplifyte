import { useState } from "react";
import { Outlet } from "react-router-dom";

import SellerSidebar from "../features/seller/components/SellerSidebar";
import SellerNavbar from "../features/seller/components/SellerNavbar";

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100">

      <SellerSidebar isOpen={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <SellerNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default SellerLayout;
