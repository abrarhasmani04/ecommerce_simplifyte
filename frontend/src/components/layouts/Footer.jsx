import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* ── Top section ─────────────────────────────── */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white">Simplifyte</h2>
            <p className="mt-4 leading-7 text-gray-400">
              Simplifyte is a modern multi-vendor e-commerce platform where
              customers can discover quality products from trusted sellers with
              a secure and seamless shopping experience.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" size={18} />
                <span>Bhavnagar, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-500" size={18} />
                <span>+91 99048 58858</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-500" size={18} />
                <span>support@simplifyte.com</span>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="transition hover:text-blue-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition hover:text-blue-400">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition hover:text-blue-400">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-blue-400">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Customer</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="transition hover:text-blue-400">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-blue-400">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-blue-400">
                  Checkout
                </Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to get the latest offers, discounts and new arrivals.
            </p>
            <div className="flex overflow-hidden rounded-xl">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 px-4 py-3 text-sm outline-none"
              />
              <button className="bg-blue-600 px-5 transition hover:bg-blue-700">
                <Send size={18} />
              </button>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-sky-500"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-pink-600"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-700"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">Simplifyte</span>. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-white">Privacy Policy</a>
            <a href="#" className="transition hover:text-white">Terms &amp; Conditions</a>
            <a href="#" className="transition hover:text-white">Contact Us</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
