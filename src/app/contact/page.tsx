"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  function submit() {
    const nextErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) nextErrors.name = "Vui lòng nhập họ và tên";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) nextErrors.email = "Email không hợp lệ";
    if (!subject.trim()) nextErrors.subject = "Vui lòng nhập tiêu đề";
    if (!message.trim() || message.trim().length < 10) nextErrors.message = "Nội dung tối thiểu 10 ký tự";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      const raw = localStorage.getItem("abc_contacts");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ id: crypto.randomUUID(), name, email, subject, message, createdAt: new Date().toISOString() });
      localStorage.setItem("abc_contacts", JSON.stringify(arr));
      setOk(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
    } catch {}
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8">
        <div className="text-3xl font-bold">Liên hệ</div>
        <div className="mt-2 text-zinc-600 dark:text-zinc-400">Chúng tôi luôn sẵn sàng hỗ trợ bạn.</div>
      </section>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 rounded-2xl border border-border p-6">
          <div className="text-xl font-semibold">Gửi yêu cầu</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" className={`w-full px-3 py-2 rounded-lg border ${errors.name ? "border-red-600" : "border-border"}`} />
              {errors.name && <div className="mt-1 text-xs text-red-600">{errors.name}</div>}
            </div>
            <div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`w-full px-3 py-2 rounded-lg border ${errors.email ? "border-red-600" : "border-border"}`} />
              {errors.email && <div className="mt-1 text-xs text-red-600">{errors.email}</div>}
            </div>
            <div className="md:col-span-2">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Tiêu đề" className={`w-full px-3 py-2 rounded-lg border ${errors.subject ? "border-red-600" : "border-border"}`} />
              {errors.subject && <div className="mt-1 text-xs text-red-600">{errors.subject}</div>}
            </div>
            <div className="md:col-span-2">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nội dung" className={`w-full h-32 px-3 py-2 rounded-lg border ${errors.message ? "border-red-600" : "border-border"}`} />
              {errors.message && <div className="mt-1 text-xs text-red-600">{errors.message}</div>}
            </div>
          </div>
          <button onClick={submit} className="mt-4 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Gửi</button>
          {ok && <div className="mt-3 text-green-600">Đã gửi yêu cầu. Chúng tôi sẽ phản hồi sớm.</div>}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-6">
            <div className="font-medium">Thông tin</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Hotline: 1900 1234</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Email: support@abcrestaurants.com</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Giờ làm việc: 8:00–22:00 (T2–CN)</div>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="font-medium">Địa chỉ</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Cơ sở 1: 123 Đường ABC, Quận 1, TP.HCM</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Cơ sở 2: 45 XYZ, Quận 7, TP.HCM</div>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="font-medium">Bản đồ</div>
            <div className="mt-2 h-40 rounded-lg overflow-hidden border border-border">
              <iframe
                title="Bản đồ ABC Restaurants"
                src="https://www.google.com/maps?q=123%20%C4%90%C6%B0%E1%BB%9Dng%20ABC%2C%20Qu%E1%BA%ADn%201%2C%20TP.HCM&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
