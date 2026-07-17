"use client";

import Link from "next/link";
import { Compass, Heart, Home, Plus, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const items: Array<{
  href: string;
  label: string;
  icon: typeof Home;
  primary?: boolean;
}> = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/classes", label: "Clases", icon: Compass },
  { href: "/create", label: "Crear", icon: Plus, primary: true },
  { href: "/match", label: "Match", icon: Heart },
  { href: "/profile", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-30 flex h-[72px] w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-black/5 bg-white px-2 pb-1 shadow-[0_-6px_20px_rgba(31,41,55,0.08)]"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        if (item.primary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label="Crear publicación"
              className="-mt-7 grid h-14 w-14 place-items-center rounded-full border-4 border-[#F3F4F6] bg-[#FBBF24] text-[#1F2937] shadow-lg"
            >
              <Icon size={29} strokeWidth={2.6} />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-14 flex-col items-center gap-1 text-xs font-medium ${
              active ? "text-[#3B82F6]" : "text-[#1F2937]/60"
            }`}
          >
            <Icon size={22} fill={active && item.href === "/home" ? "currentColor" : "none"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
