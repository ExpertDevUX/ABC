"use client";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: { name: string; phone: string; address: string; email?: string };
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
  status?: string;
  createdAt?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem("abc_orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState<{ email?: string; phone?: string } | null>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_orders") {
        try {
          const raw = e.newValue;
          setOrders(raw ? JSON.parse(raw) : []);
        } catch {}
      }
      if (e.key === "abc_user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Lịch sử đơn hàng</h1>
      {!user ? (
        <div className="mt-4 rounded-2xl border border-border p-4">
          <div className="text-sm">Bạn chưa đăng nhập. Vui lòng <a href="/account" className="underline">đăng nhập</a> để xem đơn hàng.</div>
        </div>
      ) : orders.filter((o) => {
        const byEmail = user?.email && o.customer?.email && o.customer.email === user.email;
        const byPhone = user?.phone && o.customer?.phone && o.customer.phone === user.phone;
        return !!(byEmail || byPhone);
      }).length === 0 ? (
        <p className="mt-4 text-muted-foreground">Chưa có đơn hàng.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders
            .filter((o) => {
              const byEmail = user?.email && o.customer?.email && o.customer.email === user.email;
              const byPhone = user?.phone && o.customer?.phone && o.customer.phone === user.phone;
              return !!(byEmail || byPhone);
            })
            .map((o) => (
            <div key={o.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Đơn #{o.id.slice(0, 8)}</div>
                <div className="text-sm text-muted-foreground">Tổng: {o.total.toLocaleString('vi-VN')} đ</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{o.customer.name} • {o.customer.phone} • {o.customer.address}</div>
              <div className="mt-1 text-xs text-muted-foreground">Ngày: {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</div>
              <div className="mt-1 text-xs">Trạng thái: {o.status || 'pending'}</div>
              <ul className="mt-3 text-sm list-disc pl-5">
                {o.items.map((i) => (
                  <li key={i.id} className="text-muted-foreground">{i.name} x{i.qty} — {(i.price * i.qty).toLocaleString('vi-VN')} đ</li>
                ))}
              </ul>
              {(!o.status || o.status === 'pending') && (
                <button
                  onClick={() => {
                    try {
                      const raw = localStorage.getItem("abc_orders");
                      const list: Order[] = raw ? JSON.parse(raw) : [];
                      const idx = list.findIndex((x) => x.id === o.id);
                      if (idx >= 0) list[idx] = { ...list[idx], status: 'cancelled' };
                      localStorage.setItem("abc_orders", JSON.stringify(list));
                    } catch {}
                  }}
                  className="mt-3 px-3 py-2 rounded-full bg-red-600 text-white text-sm"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
