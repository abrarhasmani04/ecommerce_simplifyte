import {
  LayoutDashboard,
  Users,
  Store,
  ClipboardList,
  Package,
  ShoppingCart,
  Tag,
  BarChart2,
  FileText,
  Settings,
  UserCircle,
  LogOut,
  Bell,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Sellers",
    path: "/admin/sellers",
    icon: Store,
  },
  {
    label: "Seller Applications",
    path: "/admin/seller-applications",
    icon: ClipboardList,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart2,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: FileText,
  },
];

export const ADMIN_NAV_BOTTOM = [
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: UserCircle,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export const LOGOUT_ITEM = {
  label: "Logout",
  icon: LogOut,
};
