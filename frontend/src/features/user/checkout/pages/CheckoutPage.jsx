import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, Plus, Pencil, Trash2, Home, Briefcase,
  ChevronRight, ShoppingBag, ArrowLeft, X, Check,
  Banknote, CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
  clearAddressError,
} from "@/redux/addressSlice";
import { clearCart } from "@/redux/cartSlice";
import { placeOrderApi } from "@/services/orderApi";
import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "@/services/paymentApi";

// ─── Empty fields ────────────────────────────────────────────────────────────
const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  addressType: "Home",
};

// ─── Field config ─────────────────────────────────────────────────────────────
const FIELDS = [
  { name: "fullName",     label: "Full Name",       placeholder: "John Doe",        col: 1 },
  { name: "phone",        label: "Phone",           placeholder: "+91 98765 43210", col: 1 },
  { name: "addressLine1", label: "Address Line 1",  placeholder: "House / Flat no., Street", col: 2 },
  { name: "addressLine2", label: "Address Line 2",  placeholder: "Landmark, Colony (optional)", col: 2, required: false },
  { name: "city",         label: "City",            placeholder: "Mumbai",          col: 1 },
  { name: "state",        label: "State",           placeholder: "Maharashtra",     col: 1 },
  { name: "country",      label: "Country",         placeholder: "India",           col: 1 },
  { name: "postalCode",   label: "Postal Code",     placeholder: "400001",          col: 1 },
];

// ─── Address Card ─────────────────────────────────────────────────────────────
const AddressCard = ({ address, selected, onSelect, onEdit, onDelete }) => {
  const Icon = address.addressType === "Office" ? Briefcase : Home;

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-100 bg-white hover:border-blue-200"
      }`}
    >
      {/* Selection indicator */}
      <span
        className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      >
        {selected && <Check size={11} strokeWidth={3} className="text-white" />}
      </span>

      {/* Type badge */}
      <div className="mb-3 flex items-center gap-1.5">
        <Icon
          size={14}
          className={selected ? "text-blue-500" : "text-gray-400"}
        />
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            selected ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {address.addressType}
        </span>
      </div>

      <p className="text-sm font-semibold text-gray-800">{address.fullName}</p>
      <p className="mt-0.5 text-sm text-gray-500">{address.phone}</p>
      <p className="mt-1.5 text-sm leading-snug text-gray-600">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
        <br />
        {address.city}, {address.state} — {address.postalCode}
        <br />
        {address.country}
      </p>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-blue-300 hover:text-blue-600 transition"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 transition"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
};

// ─── Address Mini-Form ────────────────────────────────────────────────────────
const AddressForm = ({ initial, onSave, onCancel, submitting, error }) => {
  const [form, setForm] = useState(initial ?? emptyForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())     e.fullName = "Full name is required";
    if (!form.phone.trim())        e.phone = "Phone is required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address Line 1 is required";
    if (!form.city.trim())         e.city = "City is required";
    if (!form.state.trim())        e.state = "State is required";
    if (!form.country.trim())      e.country = "Country is required";
    if (!form.postalCode.trim())   e.postalCode = "Postal code is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-800">
        {initial ? "Edit Address" : "Add New Address"}
      </h3>

      {/* API-level error */}
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map(({ name, label, placeholder, col }) => (
          <div key={name} className={col === 2 ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              {label}
              {name !== "addressLine2" && (
                <span className="text-red-400"> *</span>
              )}
            </label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${
                errors[name]
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            />
            {errors[name] && (
              <p className="mt-0.5 text-xs text-red-500">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Address Type */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Address Type <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {["Home", "Office"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((p) => ({ ...p, addressType: type }))}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition ${
                  form.addressType === type
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-blue-300"
                }`}
              >
                {type === "Home" ? <Home size={14} /> : <Briefcase size={14} />}
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Saving…" : initial ? "Update Address" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          <X size={16} />
        </button>
      </div>
    </form>
  );
};

// ─── Checkout Page ────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses, selectedAddressId, loading, submitting, error } =
    useSelector((state) => state.address);
  const { items } = useSelector((state) => state.cart);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // address object being edited
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
    return () => { dispatch(clearAddressError()); };
  }, [dispatch]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSave = async (formData) => {
    if (editingAddress) {
      const result = await dispatch(
        updateAddress({ id: editingAddress._id, ...formData })
      );
      if (!result.error) { setEditingAddress(null); setShowForm(false); }
    } else {
      const result = await dispatch(addAddress(formData));
      if (!result.error) { setShowForm(false); }
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
    // Scroll up to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    dispatch(clearAddressError());
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  // ── helper: load Razorpay SDK script once ──────────────────────────────────
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-sdk")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || items.length === 0) return;
    setPlacing(true);
    setOrderError(null);

    try {
      // 1. Create the app order (for both methods)
      const { data: orderData } = await placeOrderApi({
        addressId: selectedAddressId,
        paymentMethod,
      });

      // ── COD: done ──────────────────────────────────────────────────────────
      if (paymentMethod === "COD") {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate("/orders");
        return;
      }

      // ── Razorpay ───────────────────────────────────────────────────────────
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setOrderError("Failed to load Razorpay. Check your internet connection.");
        setPlacing(false);
        return;
      }

      // 2. Create Razorpay payment order
      const { data: payData } = await createRazorpayOrderApi(orderData.order._id);

      // 3. Open Razorpay checkout
      const options = {
        key: payData.key,
        amount: payData.razorpayOrder.amount,
        currency: payData.razorpayOrder.currency,
        name: "SimplifyTE",
        description: "Order Payment",
        order_id: payData.razorpayOrder.id,
        handler: async (response) => {
          try {
            // 4. Verify payment
            await verifyRazorpayPaymentApi({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            dispatch(clearCart());
            toast.success("Order placed successfully!");
            navigate("/orders");
          } catch (err) {
            const msg = err?.response?.data?.message ?? "Payment verification failed.";
            setOrderError(msg);
            toast.error(msg);
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            const msg = "Payment was cancelled. Your order is pending payment.";
            setOrderError(msg);
            toast.error(msg);
            setPlacing(false);
          },
        },
        theme: { color: "#3b82f6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // Note: setPlacing(false) is handled inside handler / ondismiss
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to place order. Please try again.";
      setOrderError(msg);
      toast.error(msg);
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          to="/cart"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-400">
            Select delivery address &amp; payment method
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Left: Address section ── */}
        <div className="space-y-4 lg:col-span-2">

          {/* Add / Edit form */}
          {showForm && (
            <AddressForm
              initial={
                editingAddress
                  ? {
                      fullName:     editingAddress.fullName,
                      phone:        editingAddress.phone,
                      addressLine1: editingAddress.addressLine1,
                      addressLine2: editingAddress.addressLine2 ?? "",
                      city:         editingAddress.city,
                      state:        editingAddress.state,
                      country:      editingAddress.country,
                      postalCode:   editingAddress.postalCode,
                      addressType:  editingAddress.addressType,
                    }
                  : null
              }
              onSave={handleSave}
              onCancel={handleCancelForm}
              submitting={submitting}
              error={error}
            />
          )}

          {/* Address list */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                />
              ))}
            </div>
          ) : addresses.length === 0 && !showForm ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <MapPin size={40} className="text-gray-200" />
              <p className="text-sm font-medium text-gray-500">
                No saved addresses
              </p>
              <p className="text-xs text-gray-400">
                Add an address to continue with checkout
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-1 flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <Plus size={15} /> Add Address
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    selected={selectedAddressId === addr._id}
                    onSelect={() => dispatch(selectAddress(addr._id))}
                    onEdit={() => handleEdit(addr)}
                    onDelete={() => handleDelete(addr._id)}
                  />
                ))}
              </div>

              {/* Add new address button */}
              {!showForm && (
                <button
                  onClick={() => { setEditingAddress(null); setShowForm(true); }}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-400 transition hover:border-blue-300 hover:text-blue-500"
                >
                  <Plus size={16} /> Add New Address
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            {/* Cart items mini list */}
            <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id ?? item.productId} className="flex items-center gap-2">
                  <img
                    src={item.image || "https://placehold.co/40x40?text=Img"}
                    alt={item.title}
                    className="h-10 w-10 shrink-0 rounded-lg border border-gray-100 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-gray-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="mb-3 border-gray-100" />

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-gray-800">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <hr className="my-3 border-gray-100" />

            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-600">₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "COD",     label: "Cash on Delivery", Icon: Banknote },
                  { value: "Razorpay", label: "Razorpay",         Icon: CreditCard },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentMethod(value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-semibold transition ${
                      paymentMethod === value
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-100 bg-white text-gray-500 hover:border-blue-200"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deliver to */}
            {selectedAddress && (
              <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
                <p className="mb-0.5 font-semibold text-gray-700">
                  Delivering to:
                </p>
                <p>{selectedAddress.fullName}</p>
                <p>
                  {selectedAddress.addressLine1}, {selectedAddress.city},{" "}
                  {selectedAddress.state} — {selectedAddress.postalCode}
                </p>
              </div>
            )}

            {/* Order error */}
            {orderError && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {orderError}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddressId || items.length === 0 || placing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placing ? (
                "Placing Order…"
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Place Order
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            <Link
              to="/cart"
              className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 transition"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
