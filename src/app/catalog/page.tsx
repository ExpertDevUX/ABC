"use client";
import { Suspense, useMemo, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

function CatalogContent() {
  const params = useSearchParams();
  const initialCategory = params.get("category") || "all";
  const [category, setCategory] = useState<string>(initialCategory);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>("new");
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const salePrice = (p: typeof products[number]) => Math.round(p.price * (100 - (p.discountPercent || 0)) / 100);
  const priceStats = useMemo(() => {
    const prices = products.map((p) => salePrice(p));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);
  const [minPrice, setMinPrice] = useState<number>(priceStats.min);
  const [maxPrice, setMaxPrice] = useState<number>(priceStats.max);
  const [discountMinPct, setDiscountMinPct] = useState<number>(0);
  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => (p.sizes || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCat = category === "all" || p.category === category;
      const byTxt = q.trim() === "" || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase());
      const bySale = !onSaleOnly || !!p.discountPercent;
      const byNew = !newOnly || !!p.isNew;
      const byPrice = salePrice(p) >= minPrice && salePrice(p) <= maxPrice;
      const byDiscount = discountMinPct === 0 || (p.discountPercent || 0) >= discountMinPct;
      const bySize = sizeFilters.length === 0 || (p.sizes || []).some((s) => sizeFilters.includes(s));
      return byCat && byTxt && bySale && byNew && byPrice && byDiscount && bySize;
    });
  }, [category, q, onSaleOnly, newOnly, minPrice, maxPrice, discountMinPct, sizeFilters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "price_asc":
        return arr.sort((a, b) => salePrice(a) - salePrice(b));
      case "price_desc":
        return arr.sort((a, b) => salePrice(b) - salePrice(a));
      case "discount_desc":
        return arr.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      case "views_desc":
        return arr.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "sold_desc":
        return arr.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case "new":
      default:
        return arr.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    }
  }, [filtered, sort]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Menu</h1>
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="rounded-2xl border border-border p-4 h-fit">
            <div className="text-base font-semibold">Bộ lọc</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[{ key: "all", label: "Tất cả" }, { key: "main", label: "Món chính" }, { key: "drink", label: "Đồ uống" }, { key: "dessert", label: "Tráng miệng" }].map((c) => (
                <button key={c.key} onClick={() => setCategory(c.key)} className={`px-3 py-2 rounded-lg border text-sm ${category === c.key ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>{c.label}</button>
              ))}
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm món..." className="mt-3 w-full px-3 py-2 rounded-lg border border-border" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setOnSaleOnly((v) => !v)} className={`px-3 py-2 rounded-lg border text-sm ${onSaleOnly ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>Giảm giá</button>
              <button onClick={() => setNewOnly((v) => !v)} className={`px-3 py-2 rounded-lg border text-sm ${newOnly ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>Mới</button>
            </div>
            <div className="mt-3">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                <option value="new">Mới nhất → Cũ nhất</option>
                <option value="price_asc">Giá thấp → Giá cao</option>
                <option value="price_desc">Giá cao → Giá thấp</option>
                <option value="discount_desc">Giảm giá nhiều nhất</option>
                <option value="views_desc">Xem nhiều nhất</option>
                <option value="sold_desc">Bán chạy nhất</option>
              </select>
            </div>
            <button onClick={() => { setQ(""); setOnSaleOnly(false); setNewOnly(false); setSort("new"); setMinPrice(priceStats.min); setMaxPrice(priceStats.max); setDiscountMinPct(0); setSizeFilters([]); }} className="mt-3 w-full px-3 py-2 rounded-lg border border-border text-sm">Đặt lại lọc</button>
            <button onClick={() => setAdvancedOpen((v) => !v)} className="mt-3 w-full px-3 py-2 rounded-lg border border-border text-sm">{advancedOpen ? "Ẩn nâng cao" : "Nâng cao"}</button>
            {advancedOpen && (
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-border p-3">
                  <div className="text-sm font-medium">Khoảng giá</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))} className="w-24 px-2 py-1 rounded-lg border border-border text-sm" placeholder="Từ" />
                    <span className="text-muted-foreground">—</span>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value) || priceStats.max))} className="w-24 px-2 py-1 rounded-lg border border-border text-sm" placeholder="Đến" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <button onClick={() => { setMinPrice(0); setMaxPrice(30000); }} className="px-2 py-1 rounded-full border border-border">≤ 30k</button>
                    <button onClick={() => { setMinPrice(30000); setMaxPrice(60000); }} className="px-2 py-1 rounded-full border border-border">30k–60k</button>
                    <button onClick={() => { setMinPrice(60000); setMaxPrice(priceStats.max); }} className="px-2 py-1 rounded-full border border-border">≥ 60k</button>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-sm font-medium">Giảm giá tối thiểu</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    {[0, 10, 20].map((pct) => (
                      <button key={pct} onClick={() => { setDiscountMinPct(pct); setOnSaleOnly(pct > 0); }} className={`px-3 py-2 rounded-full border ${discountMinPct === pct ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>{pct}%</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-sm font-medium">Kích thước</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizeOptions.map((s) => {
                      const active = sizeFilters.includes(s);
                      return (
                        <button key={s} onClick={() => setSizeFilters((prev) => (active ? prev.filter((x) => x !== s) : [...prev, s]))} className={`px-3 py-2 rounded-full border text-sm ${active ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>{s}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </aside>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-4 py-10"><div className="rounded-2xl border border-border p-6">Đang tải...</div></main>}>
      <CatalogContent />
    </Suspense>
  );
}
