"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SWRegistration from "./SWRegistration";

export default function NavbarClient() {
  const pathname = usePathname();

  return (
    <>
      <SWRegistration />
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
    </>
  );
}