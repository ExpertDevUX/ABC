"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { addToCart } from "@/utils/cart";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const [qty, setQty] = useState<number>(1);
  const [size, setSize] = useState<string>(product?.sizes?.[0] || "");
  const mediaItems = useMemo(() => {
    const images = (product?.images && product?.images.length > 0) ? product.images : [product?.image || "/products/placeholder.svg"];
    const items: { type: "image" | "video"; src: string }[] = images.map((src) => ({ type: "image", src }));
    if (product?.video) items.push({ type: "video", src: product.video });
    return items;
  }, [product]);
  const [active, setActive] = useState<number>(0);

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-border p-6">
          <div className="text-xl font-semibold">Không tìm thấy sản phẩm</div>
          <Link href="/catalog" className="mt-3 inline-block px-4 py-2 rounded-full border border-border text-sm">Quay lại Menu</Link>
        </div>
      </main>
    );
  }

  const hasDiscount = !!product.discountPercent;
  const salePrice = hasDiscount ? Math.round(product.price * (100 - (product.discountPercent || 0)) / 100) : product.price;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="relative h-64 md:h-96">
            {mediaItems[active].type === "image" ? (
              <Image src={mediaItems[active].src} alt={product.name} fill className="object-cover" />
            ) : (
              <video src={mediaItems[active].src} className="h-full w-full object-cover" controls />
            )}
            {product.discountPercent && (
              <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-red-600 text-white text-xs">-{product.discountPercent}%</div>
            )}
            {product.isNew && (
              <div className="absolute right-3 top-3 px-2 py-1 rounded-full bg-green-600 text-white text-xs">Mới</div>
            )}
          </div>
          <div className="p-3 border-t border-border bg-background">
            <div className="flex items-center gap-3 overflow-x-auto">
              {mediaItems.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`relative h-16 w-20 overflow-hidden rounded-md border text-xs ${active === idx ? "border-brand" : "border-border"}`}
                  aria-label={`Xem ${m.type === "image" ? "ảnh" : "video"} ${idx + 1}`}
                >
                  {m.type === "image" ? (
                    <Image src={m.src} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">🎬</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">{product.name}</div>
          <div className="mt-2 text-sm text-muted-foreground">{product.description}</div>
          <div className="mt-4 flex items-center gap-2">
            <div className="text-xl font-semibold">{salePrice.toLocaleString('vi-VN')} đ</div>
            {hasDiscount && (
              <div className="text-sm text-muted-foreground line-through">{product.price.toLocaleString('vi-VN')} đ</div>
            )}
          </div>

          {product.sizes && (
            <div className="mt-4">
              <div className="text-sm font-medium">Chọn kích thước</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 rounded-full border border-border text-sm ${size === s ? "bg-brand text-brand-contrast border-brand" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg border border-border">-</button>
            <input
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-12 h-9 text-center rounded-lg border border-border"
            />
            <button onClick={() => setQty((q) => q + 1)} className="h-9 w-9 rounded-lg border border-border">+</button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: salePrice, qty, size })}
              className="px-5 py-2 rounded-full bg-brand text-brand-contrast text-sm"
            >
              Thêm vào giỏ hàng
            </button>
            <Link href="/catalog" className="px-5 py-2 rounded-full border border-border text-sm">Quay lại Menu</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border p-4">
              <div className="font-medium">Được xem</div>
              <div className="mt-1">{(product.views || 0).toLocaleString('vi-VN')}</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="font-medium">Bán ra</div>
              <div className="mt-1">{(product.sold || 0).toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div className="text-xl font-semibold">Sản phẩm liên quan</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter((p) => p.category === product.category && p.id !== product.id)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </main>
  );
}
