import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/Providers/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://mahy-ecommerce.vercel.app/"),
  title: "M.A.H.Y E-COMMERCE",
  description:
    "A name that is recognized across the Middle East as leaders in the fields of Water Pumping Solutions, Electrical Solutions, Paper Recycling, and Logistics",
  openGraph: {
    title: "M.A.H.Y. Khoory & CO. LLC",
    description:
      "A name that is recognized across the Middle East as leaders in the fields of Water Pumping Solutions, Electrical Solutions, Paper Recycling, and Logistics",
    images: [
      {
        url: "/gallery/icon.png",
        width: 1000,
        height: 630,
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
