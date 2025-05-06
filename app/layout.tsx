import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";


const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MyFin Tracker",
  description: "Personal Finance Tracking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-[#0a0a0a] text-white`}>
        <div className="flex min-h-screen">

          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}