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
    <section className="mt-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-16 text-white text-center">
      <h2 className="text-3xl font-bold">Stay in the Loop</h2>

      <p className="mt-3 text-lg opacity-90">
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
          className="flex-1 rounded-l-lg px-4 py-3 text-gray-900 outline-none"
        />
        <button
          type="submit"
          className="rounded-r-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
