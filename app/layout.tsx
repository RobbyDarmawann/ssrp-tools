import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Inisialisasi font Montserrat
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  // Hapus 'variable' karena kita akan langsung pakai className-nya
});

export const metadata: Metadata = {
  title: "SSRP Studio | Premium RP Generator",
  description: "Generator SSRP elegan untuk kebutuhan Roleplay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Gunakan montserrat.className langsung, dan hapus 'font-sans' */}
      <body className={`${montserrat.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}