// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { Layers, Menu, X, ArrowRight } from "lucide-react";

// const navLinks = [
//   { name: "Features", href: "/features" },
//   { name: "Pricing", href: "/pricing" },
//   { name: "Solutions", href: "#solutions" },
// ];

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? "py-3 bg-[var(--color-taskr-dark)]/75 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
//           : "py-5 bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-taskr-blue)]/30 group-hover:scale-105 transition-transform duration-200">
//               <Layers className="w-5 h-5" />
//             </div>
//             <span className="font-bold text-xl tracking-tight text-white">
//               Task<span className="text-[var(--color-taskr-blue)]">r</span>
//             </span>
//           </Link>

//           {/* Desktop Links */}
//           <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Desktop Auth CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             <Link
//               href="/login"
//               className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
//             >
//               Sign In
//             </Link>
//             <Link
//               href="/signup"
//               className="glass-button-primary text-sm flex items-center gap-1.5 group"
//             >
//               <span>Get Started</span>
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
//             aria-label="Toggle Menu"
//           >
//             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Slide-down Glass Menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden absolute top-full left-0 right-0 p-4 bg-[var(--color-taskr-dark)]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
//           >
//             <div className="flex flex-col gap-2 p-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 text-base font-medium transition-colors"
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <div className="h-px bg-white/10 my-2" />
//               <Link
//                 href="/login"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 text-center font-medium"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 href="/signup"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="glass-button-primary text-center font-medium py-3"
//               >
//                 Get Started Free
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Solutions", href: "#solutions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[var(--color-taskr-dark)]/75 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-taskr-blue)]/30 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Task<span className="text-[var(--color-taskr-blue)]">r</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="glass-button-primary text-sm flex items-center gap-1.5 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Glass Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 p-4 bg-[var(--color-taskr-dark)]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
          >
            <div className="flex flex-col gap-2 p-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 text-base font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 text-center font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-button-primary text-center font-medium py-3"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}