"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem, getCart } from "@/utils/cart";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const router = useRouter();
  const [itemsCount, setItemsCount] = useState<number>(() => {
    const cart: CartItem[] = getCart();
    return cart.reduce((s, i) => s + i.qty, 0);
  });
  const [q, setQ] = useState("");
  const [siteName, setSiteName] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_settings");
      const s = raw ? JSON.parse(raw) : {};
      return s.siteName || "ABC Restaurants";
    } catch {
      return "ABC Restaurants";
    }
  });
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_settings");
      const s = raw ? JSON.parse(raw) : {};
      return s.logoUrl || "";
    } catch {
      return "";
    }
  });
  const [userInfo, setUserInfo] = useState<{ name: string; avatar?: string; role?: string } | null>(() => {
    try {
      const rawA = localStorage.getItem("abc_admin");
      if (rawA) {
        const a = JSON.parse(rawA);
        return { name: a.name, avatar: a.avatar, role: "admin" };
      }
      const rawU = localStorage.getItem("abc_user");
      if (rawU) {
        const u = JSON.parse(rawU);
        return { name: u.name, avatar: u.avatar, role: "user" };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_cart") {
        const cart: CartItem[] = getCart();
        setItemsCount(cart.reduce((s, i) => s + i.qty, 0));
      }
      if (e.key === "abc_settings") {
        try {
          const s = e.newValue ? JSON.parse(e.newValue) : {};
          setSiteName(s.siteName || "ABC Restaurants");
          setLogoUrl(s.logoUrl || "");
        } catch {}
      }
      if (e.key === "abc_admin") {
        try {
          if (e.newValue) {
            const a = JSON.parse(e.newValue);
            setUserInfo({ name: a.name, avatar: a.avatar, role: "admin" });
          } else {
            const rawU = localStorage.getItem("abc_user");
            if (rawU) {
              const u = JSON.parse(rawU);
              setUserInfo({ name: u.name, avatar: u.avatar, role: "user" });
            } else {
              setUserInfo(null);
            }
          }
        } catch {}
      }
      if (e.key === "abc_user") {
        try {
          if (e.newValue) {
            const u = JSON.parse(e.newValue);
            setUserInfo({ name: u.name, avatar: u.avatar, role: "user" });
          } else {
            const rawA = localStorage.getItem("abc_admin");
            if (rawA) {
              const a = JSON.parse(rawA);
              setUserInfo({ name: a.name, avatar: a.avatar, role: "admin" });
            } else {
              setUserInfo(null);
            }
          }
        } catch {}
      }
    }
    function onCartChanged() {
      const cart: CartItem[] = getCart();
      setItemsCount(cart.reduce((s, i) => s + i.qty, 0));
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("abc_cart_changed", onCartChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("abc_cart_changed", onCartChanged as EventListener);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <div className="relative h-8 w-8">
              <Image src={logoUrl} alt={siteName} fill className="object-cover rounded-full" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center">🍽️</div>
          )}
          <div>
            <div className="text-lg font-bold leading-none">{siteName}</div>
            <div className="text-[11px] text-muted-foreground">Món ngon • Giao nhanh</div>
          </div>
        </Link>

        <div className="flex-1 hidden md:flex">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
            placeholder="Tìm kiếm món ăn, đồ uống..."
            className="w-full px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/catalog" className="hover:text-nav-hover">Menu</Link>
          <Link href="/about" className="hover:text-nav-hover">Giới thiệu</Link>
          <Link href="/promotions" className="hover:text-nav-hover">Khuyến mãi</Link>
          <Link href="/contact" className="hover:text-nav-hover">Liên hệ</Link>
        </nav>

        <div className="flex items-center gap-3">
          {userInfo ? (
            <Link href={userInfo.role === "admin" ? "/admin" : "/account"} className="h-9 rounded-full border border-border flex items-center gap-2 px-3 hover:bg-brand hover:text-brand-contrast transition-colors">
              {userInfo.avatar ? (
                <div className="relative h-7 w-7 rounded-full overflow-hidden">
                  <Image src={userInfo.avatar} alt={userInfo.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
                  {(userInfo.name || "").slice(0,1).toUpperCase() || "U"}
                </div>
              )}
              <span className="hidden sm:block text-xs">{`Xin chào, ${userInfo.role === "admin" ? "System Admin" : userInfo.name || "User"}`}</span>
            </Link>
          ) : (
            <Link href="/account" className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-brand hover:text-brand-contrast transition-colors">👤</Link>
          )}
          <Link href="/cart" className="h-9 w-9 rounded-full border border-border flex items-center justify-center relative hover:bg-brand hover:text-brand-contrast transition-colors">
            🛒
            <span suppressHydrationWarning className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs">
              {itemsCount}
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <button
          onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
          className="md:hidden px-3 py-2 rounded-full bg-brand text-brand-contrast text-sm"
        >
          Tìm
        </button>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          placeholder="Tìm kiếm món ăn, đồ uống..."
          className="w-full px-4 py-2 rounded-full border border-border"
        />
      </div>
    </header>
  );
}

