import Link from "next/link";
import { Pizza, ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Menu", href: "/menu" },
  { name: "Sign In", href: "/sign-in" },
  { name: "Become a Vendor", href: "/sign-up" },
];

const accountLinks = [
  { name: "Create Account", href: "/sign-up" },
  { name: "Customer Login", href: "/sign-in" },
  { name: "Vendor Login", href: "/sign-in" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand Information */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <Pizza size={25} />
              </div>

              <span className="text-2xl font-bold">
                Pizza<span className="text-orange-500">Hub</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              Discover local pizza shops, explore delicious flavors,
              and enjoy a better pizza ordering experience with PizzaHub.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-orange-500"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-orange-500"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-orange-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Your Account</h3>

            <ul className="space-y-4">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-orange-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Get In Touch</h3>

            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={19} className="shrink-0 text-orange-500" />
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={19} className="shrink-0 text-orange-500" />
                <span>Contact information coming soon</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={19} className="shrink-0 text-orange-500" />
                <span>Support information coming soon</span>
              </li>
            </ul>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400"
            >
              Explore Menu <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PizzaHub. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Made with <span className="text-orange-500">♥</span> for Pizza Lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}