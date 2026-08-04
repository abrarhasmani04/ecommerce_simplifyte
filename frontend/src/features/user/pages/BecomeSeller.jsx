import { useState, useEffect } from "react";
import { Store, Building2, FileText, Phone, Info, CheckCircle, Clock, XCircle, Send } from "lucide-react";
import api from "@/services/axios";

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    iconColor: "text-yellow-500",
    textColor: "text-yellow-800",
    label: "Under Review",
    desc: "Your application is being reviewed by our team. We'll notify you soon.",
  },
  approved: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-500",
    textColor: "text-green-800",
    label: "Approved",
    desc: "Congratulations! Your seller application has been approved.",
  },
  rejected: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    textColor: "text-red-800",
    label: "Rejected",
    desc: "Your seller application was not approved.",
  },
};

const Field = ({ label, icon: Icon, children }) => (
  <div className="mb-4">
    <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-start gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
      <Icon size={16} className="mt-0.5 shrink-0 text-gray-400" />
      {children}
    </div>
  </div>
);

const BecomeSeller = () => {
  const [application, setApplication] = useState(null); // null = not applied yet
  const [checkLoading, setCheckLoading] = useState(true);

  // form state
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get("/seller/application-status");
        setApplication(data.application ?? null);
      } catch (err) {
        // 404 means no application yet — treat as null
        if (err?.response?.status !== 404) {
          console.error(err);
        }
        setApplication(null);
      } finally {
        setCheckLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitLoading(true);
    try {
      const { data } = await api.post("/seller/apply", {
        businessName,
        gstNumber,
        phone,
        aboutBusiness,
      });
      setApplication(data.application ?? { status: "pending", businessName, gstNumber, phone, aboutBusiness });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? "Failed to submit application. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (checkLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // ── Application already exists — show status card ──
  if (application) {
    const status = application.status?.toLowerCase() ?? "pending";
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = config.icon;

    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Seller Application</h1>

        <div className={`rounded-xl border ${config.border} ${config.bg} p-6`}>
          <div className="mb-4 flex items-center gap-3">
            <Icon size={28} className={config.iconColor} />
            <div>
              <p className={`text-lg font-semibold ${config.textColor}`}>
                Application {config.label}
              </p>
              <p className="text-sm text-gray-500">{config.desc}</p>
            </div>
          </div>

          {/* Application details */}
          <div className="mt-4 space-y-2 rounded-lg bg-white/70 p-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Business Name</span>
              <span>{application.businessName}</span>
            </div>
            {application.gstNumber && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">GST Number</span>
                <span>{application.gstNumber}</span>
              </div>
            )}
            {application.phone && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Phone</span>
                <span>{application.phone}</span>
              </div>
            )}
          </div>

          {/* Rejection reason */}
          {status === "rejected" && application.rejectionReason && (
            <div className="mt-4 rounded-lg border border-red-200 bg-white p-4">
              <p className="mb-1 text-sm font-semibold text-red-600">Reason for Rejection</p>
              <p className="text-sm text-gray-700">{application.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── No application yet — show form ──
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-600 p-2.5 text-white">
          <Store size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Become a Seller</h1>
          <p className="text-sm text-gray-500">Fill in your business details to apply</p>
        </div>
      </div>

      {submitSuccess ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
          <p className="text-lg font-semibold text-green-800">Application Submitted!</p>
          <p className="mt-1 text-sm text-gray-600">
            Your seller application is under review. We'll update you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <Field label="Business Name *" icon={Building2}>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-gray-700"
              placeholder="Your business or shop name"
              required
            />
          </Field>

          <Field label="GST Number" icon={FileText}>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-gray-700"
              placeholder="GST registration number (optional)"
            />
          </Field>

          <Field label="Business Phone *" icon={Phone}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-gray-700"
              placeholder="Contact number for your business"
              required
            />
          </Field>

          <Field label="About Your Business *" icon={Info}>
            <textarea
              value={aboutBusiness}
              onChange={(e) => setAboutBusiness(e.target.value)}
              className="w-full resize-none bg-transparent text-sm outline-none text-gray-700"
              placeholder="Briefly describe what you sell and your business"
              rows={3}
              required
            />
          </Field>

          {submitError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Send size={15} />
            {submitLoading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BecomeSeller;
