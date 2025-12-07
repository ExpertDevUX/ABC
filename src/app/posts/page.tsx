import Image from "next/image";
import Link from "next/link";
import { posts } from "@/data/posts";

export default function PostsPage({ searchParams }: { searchParams?: { topic?: string } }) {
  const topic = searchParams?.topic || "all";
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "news", label: "Tin tức" },
    { key: "promo", label: "Khuyến mãi" },
    { key: "event", label: "Sự kiện" },
  ];
  const list = posts.filter((b) => topic === "all" || b.topic === topic);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8">
        <div className="text-3xl font-bold">Bài viết</div>
        <div className="mt-2 text-muted-foreground">Tin tức, khuyến mãi và sự kiện từ ABC.</div>
        <div className="mt-4 flex gap-2">
          {tabs.map((t) => (
            <Link key={t.key} href={`/posts?topic=${t.key}`} className={`px-3 py-2 rounded-full border text-sm ${topic === t.key ? "bg-brand text-brand-contrast border-brand" : ""}`}>{t.label}</Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((b) => (
          <div key={b.id} className="rounded-xl border border-border overflow-hidden bg-background">
            <div className="relative h-40">
              <Image src={b.image || "/products/placeholder.svg"} alt={b.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground">{new Date(b.date).toLocaleDateString()}</div>
              <div className="mt-1 font-medium">{b.title}</div>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</div>
              <div className="mt-3 flex items-center gap-2">
                <Link href={`/posts/${b.id}`} className="px-4 py-2 rounded-full border border-border text-sm">Chi tiết</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
