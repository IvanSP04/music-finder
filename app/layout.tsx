import "./globals.css";
import type { Metadata } from "next";
import NavbarClient from "./NavbarClient";

export const metadata: Metadata = {
  title: "Music Finder",
  description: "Busca y guarda tus canciones favoritas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1db954" />
      </head>
      <body>
        {children}
        <NavbarClient />
      </body>
    </html>
  );
}