import Image from "next/image";
import Link from "next/link";
import { posts } from "@/data/posts";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const post = posts.find((b) => b.id === params.id);
  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-border p-6">
          <div className="text-xl font-semibold">Không tìm thấy bài viết</div>
          <Link href="/posts" className="mt-3 inline-block px-4 py-2 rounded-full border border-border text-sm">Quay lại danh sách</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 rounded-2xl border border-border overflow-hidden">
          <div className="relative h-64">
            <Image src={post.image || "/products/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
          <div className="p-6">
            <div className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString()}</div>
            <div className="mt-2 text-2xl font-bold">{post.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">{post.excerpt}</div>
            <div className="mt-4">
              {(post.content || "").split("\n").map((p, idx) => (
                <p key={idx} className="mt-2 text-sm text-muted-foreground">{p}</p>
              ))}
            </div>
          </div>
        </div>
        <aside className="rounded-2xl border border-border p-6 h-fit">
          <div className="text-base font-semibold">Chủ đề</div>
          <div className="mt-2 text-sm text-muted-foreground">{post.topic || "Khác"}</div>
          <Link href="/posts" className="mt-4 inline-block px-4 py-2 rounded-full border border-border text-sm">Quay lại</Link>
        </aside>
      </div>
      <div className="mt-10">
        <div className="text-xl font-semibold">Bài viết khác</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts
            .filter((b) => b.id !== post.id && (b.topic === post.topic || !post.topic))
            .slice(0, 3)
            .map((b) => (
              <div key={b.id} className="rounded-xl border border-border overflow-hidden bg-background">
                <div className="relative h-32">
                  <Image src={b.image || "/products/placeholder.svg"} alt={b.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground">{new Date(b.date).toLocaleDateString()}</div>
                  <div className="mt-1 font-medium">{b.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</div>
                  <Link href={`/posts/${b.id}`} className="mt-3 inline-block px-4 py-2 rounded-full border border-border text-sm">Chi tiết</Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
