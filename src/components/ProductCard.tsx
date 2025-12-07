"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/data/products";
import { addToCart } from "@/utils/cart";

export default function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const [qty, setQty] = useState<number>(1);
  const [size, setSize] = useState<string>(product.sizes?.[0] || "");
  const hasDiscount = !!product.discountPercent;
  const salePrice = hasDiscount ? Math.round(product.price * (100 - (product.discountPercent || 0)) / 100) : product.price;

  if (view === "list") {
    return (
      <div className="rounded-xl border border-border overflow-hidden bg-background p-4 flex gap-4">
        <div className="relative h-24 w-32 shrink-0">
          <Image src={product.image || "/products/placeholder.svg"} alt={product.name} fill className="object-cover rounded-md" />
          {product.discountPercent && (
            <div className="absolute left-2 top-2 px-2 py-1 rounded-full bg-red-600 text-white text-xs">-{product.discountPercent}%</div>
          )}
          {product.isNew && (
            <div className="absolute right-2 top-2 px-2 py-1 rounded-full bg-green-600 text-white text-xs">Mới</div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium">{product.name}</div>
          <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</div>
          {product.sizes && (
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-2 py-1 rounded-full border text-xs ${size === s ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <div className="font-semibold">{salePrice.toLocaleString('vi-VN')} đ</div>
            {hasDiscount && (
              <div className="text-sm text-muted-foreground line-through">{product.price.toLocaleString('vi-VN')} đ</div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg border border-border">-</button>
            <input
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-12 h-9 text-center rounded-lg border border-border"
            />
            <button onClick={() => setQty((q) => q + 1)} className="h-9 w-9 rounded-lg border border-border">+</button>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: salePrice, qty, size })}
              className="ml-auto px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm"
            >
              Thêm vào giỏ
            </button>
            <Link href={`/product/${product.id}`} className="px-4 py-2 rounded-full border border-border text-sm">Chi tiết</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden flex flex-col bg-background">
      <div className="relative h-40">
        <Image src={product.image || "/products/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.discountPercent && (
          <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-red-600 text-white text-xs">-{product.discountPercent}%</div>
        )}
        {product.isNew && (
          <div className="absolute right-3 top-3 px-2 py-1 rounded-full bg-green-600 text-white text-xs">Mới</div>
        )}
      </div>
      <div className="p-4">
        <div className="font-medium">{product.name}</div>
        <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</div>
        {product.sizes && (
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-2 py-1 rounded-full border text-xs ${size === s ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="font-semibold">{salePrice.toLocaleString('vi-VN')} đ</div>
          {hasDiscount && (
            <div className="text-sm text-muted-foreground line-through">{product.price.toLocaleString('vi-VN')} đ</div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg border border-border">-</button>
          <input
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 h-9 text-center rounded-lg border border-border"
          />
          <button onClick={() => setQty((q) => q + 1)} className="h-9 w-9 rounded-lg border border-border">+</button>
        </div>
      </div>
      <div className="m-4 mt-0 flex items-center gap-2">
        <Link href={`/product/${product.id}`} className="px-4 py-2 rounded-full border border-border text-sm">Chi tiết</Link>
        <button
          onClick={() => addToCart({ id: product.id, name: product.name, price: salePrice, qty, size })}
          className="px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
