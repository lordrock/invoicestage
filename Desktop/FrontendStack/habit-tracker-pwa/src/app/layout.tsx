import type { Metadata } from "next";
import ServiceWorkerRegister from "../components/shared/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A habit tracking progressive web app",
  manifest: "/manifest.json",
  themeColor: "#0f172a"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}