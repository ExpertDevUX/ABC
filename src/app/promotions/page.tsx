import { products } from "@/data/products";
import Link from "next/link";
import React from "react";

export default async function PromotionsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const category = sp?.category || "all";
  const promos = products.filter((p) => p.discountPercent && (category === "all" || p.category === category));
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "main", label: "Món chính" },
    { key: "drink", label: "Đồ uống" },
    { key: "dessert", label: "Tráng miệng" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8">
        <div className="text-3xl font-bold">Chương trình khuyến mãi</div>
        <div className="mt-2 text-muted-foreground">Ưu đãi theo mùa, mã giảm giá và combo tiết kiệm.</div>
        <div className="mt-4 flex gap-2">
          {tabs.map((t) => (
            <Link key={t.key} href={`/promotions?category=${t.key}`} className={`px-3 py-2 rounded-full border text-sm ${category === t.key ? "bg-brand text-brand-contrast border-brand" : ""}`}>{t.label}</Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {promos.map((p) => (
          <div key={p.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs px-2 py-1 rounded-full bg-red-600 text-white">-{p.discountPercent}%</div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{p.description}</div>
            <div className="mt-2 font-semibold">{p.price.toLocaleString('vi-VN')} đ</div>
            <Link href={`/catalog?category=${p.category}`} className="mt-3 inline-block text-sm underline">Xem thêm</Link>
          </div>
        ))}
        {promos.length === 0 && <div>Hiện chưa có chương trình.</div>}
      </div>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">Mã giảm giá</div>
          <div className="mt-2 text-sm text-muted-foreground">Nhập mã <span className="font-semibold">SAVE10</span> để giảm 10% đơn hàng.</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">Điều kiện áp dụng</div>
          <div className="mt-2 text-sm text-muted-foreground">Áp dụng cho đơn nội thành, không cộng dồn nhiều mã.</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">Thời gian</div>
          <div className="mt-2 text-sm text-muted-foreground">Các chương trình theo tuần/tháng, cập nhật thường xuyên.</div>
        </div>
      </section>
    </main>
  );
}
