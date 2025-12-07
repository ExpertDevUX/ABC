import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center">🍽️</div>
            <div className="text-base font-semibold">ABC Restaurants</div>
          </div>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
            <li>Hotline: 1900 1234</li>
            <li>Email: support@abcrestaurants.com</li>
            <li>Giờ làm việc: 8:00–22:00 (T2–CN)</li>
          </ul>
        </div>
        <div>
          <div className="text-base font-semibold">Danh mục liên kết</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/about">Giới thiệu</Link></li>
            <li><Link href="/contact">Liên hệ</Link></li>
            <li><Link href="/policies">Chính sách bảo mật</Link></li>
            <li><Link href="/policies">Điều khoản sử dụng</Link></li>
            <li><Link href="/policies">Chính sách đổi trả</Link></li>
            <li><Link href="/promotions">Khuyến mãi</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-base font-semibold">Hướng dẫn</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/policies">Hướng dẫn mua hàng</Link></li>
            <li><Link href="/policies">Phương thức thanh toán</Link></li>
            <li><Link href="/policies">Chính sách vận chuyển</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-base font-semibold">Hỗ trợ khách hàng</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/policies">Câu hỏi thường gặp (FAQ)</Link></li>
            <li><Link href="/contact">Trung tâm hỗ trợ</Link></li>
            <li><Link href="/policies">Hướng dẫn bảo hành</Link></li>
            <li><Link href="#">Chat trực tuyến</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-base font-semibold">Kết nối</div>
          <div className="mt-2 flex items-center gap-3">
            <Link href="#" aria-label="Facebook" className="h-9 w-9 rounded-full text-white flex items-center justify-center bg-[#1877F2] hover:opacity-90 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.242 0-1.628.771-1.628 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </Link>
            <Link href="#" aria-label="Instagram" className="h-9 w-9 rounded-full text-white flex items-center justify-center bg-gradient-to-br from-[#fdf497] via-[#fd5949] to-[#d6249f] hover:opacity-90 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
            </Link>
            <Link href="#" aria-label="Zalo" className="h-9 w-9 rounded-full text-white flex items-center justify-center bg-[#0068FF] hover:opacity-90 transition">
              Z
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ABC Restaurants. All rights reserved.
      </div>
    </footer>
  );
}
