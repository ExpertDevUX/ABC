"use client";
import { useEffect, useMemo, useState } from "react";
import { CartItem, clearCart, getCart } from "@/utils/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { products } from "@/data/products";

type Order = {
  id: string;
  customer: { name: string; phone: string; address: string; email?: string };
  items: CartItem[];
  total: number;
  status?: string;
  createdAt?: string;
  paymentMethod?: "cod" | "card" | "ewallet";
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const [name, setName] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.name || "";
    } catch {
      return "";
    }
  });
  const [phone, setPhone] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.phone || "";
    } catch {
      return "";
    }
  });
  const [address, setAddress] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.address || "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.email || "";
    } catch {
      return "";
    }
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "ewallet">("cod");
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_cart") {
        setItems(getCart());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const shipping = items.length > 0 ? 15000 : 0;
  const total = Math.max(0, subtotal) + shipping;

  function placeOrder() {
    setMessage("");
    if (!name || !phone || !address || items.length === 0) {
      setMessage("Vui lòng điền đủ thông tin giao hàng");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setMessage("Email không hợp lệ");
      return;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      customer: { name, phone, address, email },
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentMethod,
    };
    try {
      const raw = localStorage.getItem("abc_orders");
      const orders = raw ? JSON.parse(raw) : [];
      orders.push(order);
      localStorage.setItem("abc_orders", JSON.stringify(orders));
      try {
        const outboxRaw = localStorage.getItem("abc_outbox");
        const outbox = outboxRaw ? JSON.parse(outboxRaw) : [];
        outbox.push({ to: email, subject: "Xác nhận đơn hàng ABC", orderId: order.id, total: order.total, date: new Date().toISOString() });
        localStorage.setItem("abc_outbox", JSON.stringify(outbox));
      } catch {}
    } catch {}
    clearCart();
    setPaid(true);
    setTimeout(() => router.push("/account/orders"), 1200);
  }

  return (
    <main suppressHydrationWarning className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Thanh toán</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Giỏ hàng trống.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border p-4">
              <div className="font-medium">Thông tin giao hàng</div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" className="px-3 py-2 rounded-lg border" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className="px-3 py-2 rounded-lg border" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-lg border" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ" className="md:col-span-2 px-3 py-2 rounded-lg border" />
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">Phương thức thanh toán</div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === "cod" ? "border-brand" : "border-border"}`}>
                  <input type="radio" name="pm" className="mr-2" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === "card" ? "border-brand" : "border-border"}`}>
                  <input type="radio" name="pm" className="mr-2" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  Thẻ tín dụng/ghi nợ
                </label>
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === "ewallet" ? "border-brand" : "border-border"}`}>
                  <input type="radio" name="pm" className="mr-2" checked={paymentMethod === "ewallet"} onChange={() => setPaymentMethod("ewallet")} />
                  Ví điện tử (MOMO/ZaloPay)
                </label>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">Thông tin giỏ hàng</div>
              <div className="mt-3 space-y-3">
                {items.map((i) => (
                  <div key={`${i.id}-${i.size || ''}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md">
                        <Image src={(products.find((p) => p.id === i.id)?.image) || "/products/placeholder.svg"} alt={i.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{i.name}</div>
                        {i.size && <div className="text-xs text-muted-foreground">{i.size}</div>}
                        <div className="text-xs text-muted-foreground">SL: {i.qty}</div>
                      </div>
                    </div>
                    <div className="text-sm">{(i.price * i.qty).toLocaleString('vi-VN')} đ</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Tạm tính</div>
              <div className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-muted-foreground">Phí vận chuyển</div>
              <div className="font-semibold">{shipping.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-muted-foreground">Tổng cộng</div>
              <div className="text-lg font-bold">{total.toLocaleString('vi-VN')} đ</div>
            </div>
            <button onClick={placeOrder} className="mt-4 w-full px-4 py-2 rounded-full bg-zinc-900 text-white text-sm dark:bg-zinc-100 dark:text-black">
              Đặt hàng
            </button>
            {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
            {paid && <div className="mt-3 text-green-600">Đặt hàng thành công!</div>}
          </div>
        </div>
      )}
    </main>
  );
}
