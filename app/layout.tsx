"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SWRegistration from "./SWRegistration";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1db954" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Music Finder</title>
      </head>
      <body>
        <SWRegistration />
        {children}
        <nav className="navbar">
          <Link href="/" className={pathname === "/" ? "activo" : ""}>
            <span>🔍</span>
            Buscar
          </Link>
          <Link href="/favoritos" className={pathname === "/favoritos" ? "activo" : ""}>
            <span>❤️</span>
            Favoritos
          </Link>
        </nav>
      </body>
    </html>
  );
}