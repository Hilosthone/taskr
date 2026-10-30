// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import AmbientBackground from "@/components/shared/AmbientBackground";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Taskr — Modern Project & Task Management",
//   description: "A high-performance, collaborative workspace for modern teams.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="dark">
//       <body className={`${inter.className} relative min-h-screen antialiased text-slate-100 bg-[var(--color-taskr-dark)]`}>
//         <AmbientBackground />
//         {children}
//       </body>
//     </html>
//   );
// }



import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AmbientBackground from "@/components/shared/AmbientBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskr — Modern Project & Task Management",
  description: "A high-performance, collaborative workspace for modern teams.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} relative min-h-screen antialiased text-slate-100 bg-[var(--color-taskr-dark)]`}>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}