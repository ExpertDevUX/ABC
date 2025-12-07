import Link from "next/link";
import { products } from "@/data/products";
import { posts } from "@/data/posts";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Đặt món ngon từ ABC Restaurants, giao nhanh trong ngày
            </h1>
            <p className="mt-4 text-muted-foreground">
              Duyệt menu đa dạng, chọn món yêu thích và thanh toán trực tuyến.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/catalog" className="px-5 py-3 rounded-full bg-brand text-brand-contrast text-sm">
                Xem Menu
              </Link>
              <Link href="/account" className="px-5 py-3 rounded-full border border-border text-sm hover:bg-brand hover:text-brand-contrast">
                Quản lý tài khoản
              </Link>
            </div>
          </div>
          <div className="h-64 md:h-80 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
            <div className="text-6xl">🍜🍔🥤</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Danh mục nổi bật</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/catalog?category=main" className="rounded-xl border border-border p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <div className="text-xl font-medium">Món chính</div>
            <div className="mt-2 text-sm text-muted-foreground">Cơm, phở, bún, burger...</div>
          </Link>
          <Link href="/catalog?category=drink" className="rounded-xl border border-border p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <div className="text-xl font-medium">Đồ uống</div>
            <div className="mt-2 text-sm text-muted-foreground">Trà, cà phê, nước ép...</div>
          </Link>
          <Link href="/catalog?category=dessert" className="rounded-xl border border-border p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <div className="text-xl font-medium">Tráng miệng</div>
            <div className="mt-2 text-sm text-muted-foreground">Bánh ngọt, kem...</div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Sản phẩm khuyến mãi</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.filter((p) => p.discountPercent).slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Sản phẩm mới</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.filter((p) => p.isNew).slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Bài viết mới nhất</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((b) => (
            <div key={b.id} className="rounded-xl border border-border p-6">
              <div className="text-sm text-muted-foreground">{(() => { const [y,m,d] = b.date.split("-"); return `${d}/${m}/${y}`; })()}</div>
              <div className="mt-2 font-medium">{b.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{b.excerpt}</div>
              <Link href="/promotions" className="mt-3 inline-block text-sm underline">Xem chi tiết</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
