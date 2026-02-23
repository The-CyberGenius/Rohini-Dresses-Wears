import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "Rohini Dresses & Wears | Wholesale Clothing, Uniforms & Fabrics",
    template: "%s | Rohini Dresses & Wears",
  },
  description:
    "Wholesale clothing supplier in Ratangarh, Rajasthan. School uniforms, hotel bedsheets, curtains, sarees, dress materials & ready-made dresses at best wholesale prices. Owner: Siddharth.",
  keywords: [
    "wholesale clothing",
    "school uniforms",
    "hotel bedsheets",
    "curtains",
    "sarees",
    "fabrics",
    "Rohini",
    "Rajasthan",
    "bulk order",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased selection:bg-primary-200 selection:text-primary-900">
        <Navbar />
        {/* pb-16 added to account for the bottom nav on mobile screens */}
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
