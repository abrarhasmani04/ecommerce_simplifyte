import { useState } from "react";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You've subscribed to our newsletter!");
    setEmail("");
  };

  return (
    <section
      className="mt-14 rounded-2xl px-10 py-16 text-center"
      style={{
        background: "linear-gradient(to right, #2563eb, #4f46e5)",
        color: "#ffffff",
      }}
    >
      <h2 className="text-3xl font-bold">Stay in the Loop</h2>
      <p className="mt-3 text-lg" style={{ opacity: 0.9 }}>
        Subscribe to get exclusive deals, new arrivals, and offers straight to
        your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-l-lg px-4 py-3 outline-none"
          style={{ color: "#111827" }}
        />
        <button
          type="submit"
          className="rounded-r-lg bg-white px-6 py-3 font-semibold transition hover:bg-gray-100"
          style={{ color: "#1d4ed8" }}
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
