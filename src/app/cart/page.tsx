"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartItem, getCart, saveCart, updateQty } from "@/utils/cart";
import { products } from "@/data/products";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const [voucher, setVoucher] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_cart") {
        setItems(getCart());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = useMemo(() => {
    if (voucher.trim().toUpperCase() === "SAVE10") return Math.round(subtotal * 0.1);
    return 0;
  }, [voucher, subtotal]);
  const shipping = items.length > 0 ? 15000 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  return (
    <main suppressHydrationWarning className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Giỏ hàng</h1>
      {items.length === 0 ? (
        <div className="mt-6">
          <p className="text-muted-foreground">Chưa chọn mua sản phẩm.</p>
          <Link href="/catalog" className="mt-4 inline-block px-4 py-2 rounded-full border border-border">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={`${i.id}-${i.size || ''}`} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-20 overflow-hidden rounded-md">
                    <Image src={(products.find((p) => p.id === i.id)?.image) || "/products/placeholder.svg"} alt={i.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{i.name}</div>
                    {i.size && <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full border border-border text-xs">{i.size}</div>}
                    <div className="text-sm text-muted-foreground">Đơn giá: {i.price.toLocaleString('vi-VN')} đ</div>
                    <div className="text-xs">Thành tiền: {(i.price * i.qty).toLocaleString('vi-VN')} đ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const qty = Math.max(0, i.qty - 1);
                      updateQty(i.id, qty, i.size);
                      setItems(getCart());
                    }}
                    className="h-9 w-9 rounded-lg border border-border"
                  >
                    -
                  </button>
                  <input
                    value={i.qty}
                    onChange={(e) => {
                      const next = Math.max(0, Number(e.target.value) || 0);
                      updateQty(i.id, next, i.size);
                      setItems(getCart());
                    }}
                    type="number"
                    min={0}
                    className="w-12 h-9 text-center rounded-lg border border-border"
                  />
                  <button
                    onClick={() => {
                      updateQty(i.id, i.qty + 1, i.size);
                      setItems(getCart());
                    }}
                    className="h-9 w-9 rounded-lg border border-border"
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      updateQty(i.id, 0, i.size);
                      setItems(getCart());
                    }}
                    className="ml-2 h-9 px-3 rounded-lg border border-border text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-border p-4">
              <div className="font-medium">Ghi chú đơn hàng</div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: ít đá, thêm sốt..." className="mt-2 w-full h-24 px-3 py-2 rounded-lg border border-border" />
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Tạm tính</div>
              <div className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-muted-foreground">Giảm giá</div>
              <div className="font-semibold">-{discount.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-muted-foreground">Phí vận chuyển</div>
              <div className="font-semibold">{shipping.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="mt-3">
              <input value={voucher} onChange={(e) => setVoucher(e.target.value)} placeholder="Mã giảm giá (SAVE10)" className="w-full px-3 py-2 rounded-lg border border-border" />
            </div>
            <button
              onClick={() => {
                const raw = localStorage.getItem("abc_user");
                if (!raw) {
                  router.push("/account");
                } else {
                  router.push("/checkout");
                }
              }}
              className="mt-4 w-full px-4 py-2 rounded-full bg-zinc-900 text-white text-center text-sm dark:bg-zinc-100 dark:text-black"
            >
              Thanh toán
            </button>
            <button
              onClick={() => {
                saveCart([]);
                setItems([]);
              }}
              className="mt-2 w-full px-4 py-2 rounded-full border border-border text-sm"
            >
              Xóa giỏ hàng
            </button>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-muted-foreground">Tổng cộng</div>
              <div className="text-lg font-bold">{total.toLocaleString('vi-VN')} đ</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
