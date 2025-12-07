"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [category, setCategory] = useState<string>("all");
  const results = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return [];
    return products.filter((p) => {
      const byTxt = `${p.name} ${p.description}`.toLowerCase().includes(keyword);
      const byCat = category === "all" || p.category === category;
      return byTxt && byCat;
    });
  }, [q, category]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Kết quả tìm kiếm</h1>
      <div className="mt-2 text-sm text-muted-foreground">Từ khóa: {q ? `"${q}"` : "(trống)"}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[{ key: "all", label: "Tất cả" }, { key: "main", label: "Món chính" }, { key: "drink", label: "Đồ uống" }, { key: "dessert", label: "Tráng miệng" }].map((c) => (
          <button key={c.key} onClick={() => setCategory(c.key)} className={`px-3 py-2 rounded-full border text-sm ${category === c.key ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>{c.label}</button>
        ))}
      </div>
      {!q || results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border p-6">
          <div className="text-sm text-muted-foreground">{q ? "Không có kết quả phù hợp." : "Nhập từ khóa vào ô tìm kiếm để bắt đầu."}</div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-4 py-10"><div className="rounded-2xl border border-border p-6">Đang tải...</div></main>}>
      <SearchContent />
    </Suspense>
  );
}
