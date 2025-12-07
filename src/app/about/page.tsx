import { products } from "@/data/products";
import Image from "next/image";

export default function AboutPage() {
  const total = products.length;
  const main = products.filter((p) => p.category === "main").length;
  const drink = products.filter((p) => p.category === "drink").length;
  const dessert = products.filter((p) => p.category === "dessert").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div>
          <div className="text-3xl font-bold">ABC Restaurants</div>
          <div className="mt-2 text-muted-foreground">Trải nghiệm đặt món trực tuyến nhanh, ngon, tiện lợi.</div>
          <div className="mt-6 flex gap-3">
            <a href="/catalog" className="px-5 py-3 rounded-full bg-brand text-brand-contrast text-sm">Xem Menu</a>
            <a href="/contact" className="px-5 py-3 rounded-full border border-border text-sm">Liên hệ</a>
          </div>
        </div>
        <div className="relative h-64 md:h-80">
          <Image src="/about/hero.svg" alt="ABC Restaurants" fill className="object-cover rounded-xl" />
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">Chất lượng</div>
          <div className="mt-2 text-sm text-muted-foreground">Nguyên liệu tuyển chọn, món ăn chuẩn vị, quy trình đảm bảo.</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">Nhanh chóng</div>
          <div className="mt-2 text-sm text-muted-foreground">Đặt món đơn giản, giao nhanh trong ngày.</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-base font-semibold">An toàn</div>
          <div className="mt-2 text-sm text-muted-foreground">Hệ thống vận hành an toàn, thanh toán tiện lợi.</div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground">Món ăn</div>
          <div className="mt-1 text-2xl font-semibold">{total}</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground">Món chính</div>
          <div className="mt-1 text-2xl font-semibold">{main}</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground">Đồ uống</div>
          <div className="mt-1 text-2xl font-semibold">{drink}</div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground">Tráng miệng</div>
          <div className="mt-1 text-2xl font-semibold">{dessert}</div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Sứ mệnh & Giá trị</div>
        <div className="mt-2 text-sm text-muted-foreground">Mang đến trải nghiệm ẩm thực trực tuyến hiện đại, an toàn và tiện lợi.</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Sứ mệnh</div>
            <div className="mt-1 text-sm text-muted-foreground">Kết nối món ngon với mọi người, tối ưu từ đặt món đến giao nhận.</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Giá trị</div>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Chất lượng</li>
              <li>Minh bạch</li>
              <li>Khách hàng là trung tâm</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Cam kết</div>
            <div className="mt-1 text-sm text-muted-foreground">Giao đúng hạn, đúng món, hỗ trợ nhanh chóng khi có vấn đề.</div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="text-xl font-semibold">Câu chuyện</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6">
          <div className="text-sm text-muted-foreground">2022</div>
          <div className="mt-2 font-medium">Khởi động dự án</div>
          <div className="mt-1 text-sm text-muted-foreground">Xây dựng nền tảng đặt món trực tuyến.</div>
        </div>
          <div className="rounded-xl border border-border p-6">
            <div className="text-sm text-muted-foreground">2024</div>
            <div className="mt-2 font-medium">Mở rộng thực đơn</div>
            <div className="mt-1 text-sm text-muted-foreground">Bổ sung món mới và đa dạng danh mục.</div>
          </div>
          <div className="rounded-xl border border-border p-6">
            <div className="text-sm text-muted-foreground">2025</div>
            <div className="mt-2 font-medium">Tối ưu trải nghiệm</div>
            <div className="mt-1 text-sm text-muted-foreground">Giao diện hiện đại, tốc độ nhanh, an toàn.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
