import { isRejected } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const SILENT_ACTIONS = new Set([
  "cart/getMyCart/rejected",
  "wishlist/fetch/rejected",
  "address/fetchAll/rejected",
  "seller/fetchDashboard/rejected",
  "seller/fetchProducts/rejected",
  "seller/fetchOrders/rejected",
  "seller/fetchAnalytics/rejected",
  "admin/fetchDashboard/rejected",
  "admin/fetchUsers/rejected",
  "admin/fetchSellerApplications/rejected",
]);

const toastMiddleware = () => (next) => (action) => {
  if (isRejected(action) && !SILENT_ACTIONS.has(action.type)) {
    const message =
      (typeof action.payload === "string" ? action.payload : null) ??
      (typeof action.payload?.message === "string" ? action.payload.message : null) ??
      action.error?.message ??
      "Something went wrong. Please try again.";

    toast.error(message);
  }

  return next(action);
};

export default toastMiddleware;
