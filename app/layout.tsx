import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/authContext";
import { UIProvider } from "../context/UIContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustNet - Build Trust for Your Local Business",
  description:
    "TrustNet helps small businesses establish verified digital identities through community validation and UPI transaction verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="transition-colors duration-300">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased bg-[#f5f8ff] text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300`}>
        <AuthProvider>
          <UIProvider>
            <Navbar />
            {children}
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
