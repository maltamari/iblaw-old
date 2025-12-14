import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/Navbar/topbar";
import Navbar from "@/components/Navbar/navbar";
import Container from "@/components/Global/container";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Global/footer";
import ScrollRestorer from "@/components/Global/ScrollRestorer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IBLaw | International Business Law Firm",
    template: "%s | IBLaw",
  },
  description:
    "IBLaw is a leading international business law firm providing comprehensive legal services in corporate, commercial, regulatory, and dispute resolution matters.",
  keywords: [
    "IBLaw",
    "Law Firm",
    "Business Law",
    "Corporate Law",
    "Legal Services",
    "International Law Firm",
  ],
  authors: [{ name: "IBLaw" }],
  creator: "IBLaw",
  publisher: "IBLaw",
  metadataBase: new URL("https://iblaw.com"), 
  openGraph: {
    title: "IBLaw | International Business Law Firm",
    description:
      "A trusted international law firm delivering strategic legal solutions for businesses and individuals.",
    type: "website",
    locale: "en_US",
    siteName: "IBLaw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Topbar/>
        <Navbar/>
        <ScrollRestorer/>
        <Container maxWidth="full" padding={false}>
        {children}
        </Container>
        <Footer/>
        <Toaster position="top-right"/>
      </body>
   
    </html>
  );
}
