import type { Metadata } from "next";
import { Lato, Cabin } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../components/AuthContext';

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: "700",
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayWise Swift",
  description: "PayWise Swift",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${cabin.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
