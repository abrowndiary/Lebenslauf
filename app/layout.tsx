import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lebenslauf | German AI CV Builder",
  description: "German-first AI CV builder for job applications in Germany, Austria, and Switzerland.",
  icons: {
    icon: "/brand/icon.png",
    apple: "/brand/icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
