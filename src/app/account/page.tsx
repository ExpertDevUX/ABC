"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type User = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  username?: string;
};

type DBUser = User & { password: string; verified?: boolean; verificationToken?: string };
type Order = {
  id: string;
  customer: { name: string; phone: string; address: string; email?: string };
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
  status?: string;
  createdAt?: string;
};

export default function AccountPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("abc_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(user ? "" : "Bạn chưa đăng nhập");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [section, setSection] = useState<"profile" | "orders" | "security">("profile");

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  

  function doLogin() {
    setMessage("");
    const identifier = email?.trim();
    if (!identifier || !password) {
      setMessage("Vui lòng nhập thông tin đăng nhập (email/sđt/tên) và mật khẩu");
      return;
    }
    (async () => {
      try {
        if (apiBase) {
          const res = await fetch(`${apiBase}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
          if (!res.ok) { setMessage("Đăng nhập thất bại"); return; }
          const data = await res.json();
          const profile: User = { name: data.name, email: data.email, phone: data.phone, address: data.address, avatar: data.avatar, username: data.username };
          localStorage.setItem("abc_token", String(data.token || ""));
          localStorage.setItem("abc_user", JSON.stringify(profile));
          setUser(profile);
          setMessage("Đăng nhập thành công");
        } else {
          const dbRaw = localStorage.getItem("abc_users");
          const db: (User & { password: string; verified?: boolean; verificationToken?: string; username?: string })[] = dbRaw ? JSON.parse(dbRaw) : [];
          const normalized = identifier.toLowerCase();
          const digits = identifier.replace(/\D/g, "");
          const u = db.find((x) => {
            const emailMatch = (x.email || "").trim().toLowerCase() === normalized;
            const phoneMatch = digits && (x.phone || "").replace(/\D/g, "") === digits;
            const usernameMatch = x.username ? String(x.username).trim().toLowerCase() === normalized : false;
            const nameMatch = (x.name || "").trim().toLowerCase() === normalized;
            return emailMatch || phoneMatch || usernameMatch || nameMatch;
          });
          if (!u) { setMessage("Tài khoản không tồn tại (email/sđt/tên đăng nhập không đúng)"); return; }
          if (u.password !== password) { setMessage("Mật khẩu không đúng"); return; }
          if (!u.verified) { setMessage("Tài khoản chưa kích hoạt (chưa xác thực email)"); return; }
          localStorage.setItem("abc_user", JSON.stringify({ name: u.name, email: u.email, phone: u.phone, address: u.address, avatar: u.avatar }));
          setUser({ name: u.name, email: u.email, phone: u.phone, address: u.address, avatar: u.avatar });
          setMessage("Đăng nhập thành công");
        }
      } catch {
        setMessage("Có lỗi xảy ra");
      }
    })();
  }

  function doRegister() {
    setMessage("");
    const nextErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) nextErrors.name = "Vui lòng nhập họ và tên";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) nextErrors.email = "Email không hợp lệ";
    if (!password || password.length < 6) nextErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    (async () => {
      try {
        if (apiBase) {
          const res = await fetch(`${apiBase}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone, address, password }) });
          if (!res.ok) { setMessage("Đăng ký thất bại"); return; }
          setMode("login");
          setMessage("Đăng ký thành công. Vui lòng kiểm tra email để xác thực.");
        } else {
          const dbRaw = localStorage.getItem("abc_users");
          const db: (User & { password: string; verified?: boolean; verificationToken?: string })[] = dbRaw ? JSON.parse(dbRaw) : [];
          const exists = db.some((x) => x.email.trim().toLowerCase() === email.trim().toLowerCase());
          if (exists) { setMessage("Tài khoản đã tồn tại"); return; }
          const token = crypto.randomUUID();
          const newUser = { name: name.trim(), email: email.trim().toLowerCase(), phone, address, password, verified: false, verificationToken: token };
          db.push(newUser);
          localStorage.setItem("abc_users", JSON.stringify(db));
          try {
            const outboxRaw = localStorage.getItem("abc_outbox");
            const outbox = outboxRaw ? JSON.parse(outboxRaw) : [];
            outbox.push({ to: newUser.email, subject: "Xác thực tài khoản ABC", token, date: new Date().toISOString() });
            localStorage.setItem("abc_outbox", JSON.stringify(outbox));
          } catch {}
          setMode("login");
          setMessage("Đăng ký thành công. Vui lòng kiểm tra email để xác thực.");
        }
      } catch {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại");
      }
    })();
  }

  function logout() {
    localStorage.removeItem("abc_user");
    setUser(null);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Tài khoản</h1>
      {!user ? (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-border p-6">
            <div className="text-xl font-semibold">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</div>
            <div className="mt-1 text-sm text-muted-foreground">Quản lý đơn hàng và thông tin cá nhân dễ dàng.</div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setMode("login")} className={`px-4 py-2 rounded-full text-sm ${mode === "login" ? "bg-brand text-brand-contrast" : "border border-border"}`}>Đăng nhập</button>
              <button onClick={() => setMode("register")} className={`px-4 py-2 rounded-full text-sm ${mode === "register" ? "bg-brand text-brand-contrast" : "border border-border"}`}>Đăng ký</button>
            </div>
            {mode === "login" ? (
              <div className="mt-6 grid gap-3">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email / SĐT / Tên đăng nhập" className="px-3 py-2 rounded-lg border border-border" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="px-3 py-2 rounded-lg border border-border" />
                <button onClick={doLogin} className="mt-2 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Đăng nhập</button>
                {message && <div className="text-sm text-muted-foreground">{message}</div>}
                <div className="text-xs text-muted-foreground">Xác thực email: kiểm tra hộp thư. Nếu cần, chúng tôi đã lưu mã trong hệ thống để demo.</div>
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                <div>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" className={`w-full px-3 py-2 rounded-lg border ${errors.name ? "border-red-600" : "border-border"}`} />
                  {errors.name && <div className="mt-1 text-xs text-red-600">{errors.name}</div>}
                </div>
                <div>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`w-full px-3 py-2 rounded-lg border ${errors.email ? "border-red-600" : "border-border"}`} />
                  {errors.email && <div className="mt-1 text-xs text-red-600">{errors.email}</div>}
                </div>
                <div>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className={`w-full px-3 py-2 rounded-lg border ${errors.password ? "border-red-600" : "border-border"}`} />
                  {errors.password && <div className="mt-1 text-xs text-red-600">{errors.password}</div>}
                </div>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className="px-3 py-2 rounded-lg border border-border" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ" className="px-3 py-2 rounded-lg border border-border" />
                <button onClick={doRegister} className="mt-2 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Đăng ký</button>
                {message && <div className="text-sm text-muted-foreground">{message}</div>}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="text-base font-semibold">Lợi ích tài khoản</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Theo dõi đơn hàng</li>
              <li>Lưu địa chỉ, phương thức thanh toán</li>
              <li>Nhận ưu đãi và mã giảm giá</li>
            </ul>
          </div>
        </section>
      ) : (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 rounded-2xl border border-border p-4 h-fit">
            <div className="text-base font-semibold">Xin chào</div>
            <div className="mt-1 text-sm text-muted-foreground">{user.name}</div>
            <div className="mt-3 grid gap-2 text-sm">
              <button onClick={() => setSection("profile")} className={`px-3 py-2 rounded-lg border border-border ${section === "profile" ? "bg-brand text-brand-contrast border-brand" : ""}`}>Thông tin cá nhân</button>
              <button onClick={() => setSection("orders")} className={`px-3 py-2 rounded-lg border border-border ${section === "orders" ? "bg-brand text-brand-contrast border-brand" : ""}`}>Đơn hàng</button>
              <button onClick={() => setSection("security")} className={`px-3 py-2 rounded-lg border border-border ${section === "security" ? "bg-brand text-brand-contrast border-brand" : ""}`}>Bảo mật</button>
              <button onClick={logout} className="mt-2 px-3 py-2 rounded-lg border border-border">Đăng xuất</button>
            </div>
          </aside>
          <div className="md:col-span-3 rounded-2xl border border-border p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/15 dark:to-red-900/15">
            <div className="md:hidden -mt-2 mb-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                {["profile","orders","security"].map((key) => (
                  <button key={key} onClick={() => setSection(key as typeof section)} className={`px-3 py-2 rounded-full border text-sm whitespace-nowrap ${section === key ? "bg-brand text-brand-contrast border-brand" : "border-border"}`}>
                    {key === "profile" ? "Thông tin" : key === "orders" ? "Đơn hàng" : "Bảo mật"}
                  </button>
                ))}
              </div>
            </div>
            {section === "profile" && (
              <div className="rounded-2xl border border-border p-4 bg-background/80 shadow-sm">
                <div className="text-xl font-semibold">Thông tin cá nhân</div>
                <div className="mt-2 text-sm text-muted-foreground">Cập nhật tên, số điện thoại và địa chỉ.</div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border border-border bg-zinc-100 dark:bg-zinc-900">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">👤</div>
                    )}
                  </div>
                  <label className="px-3 py-2 rounded-full border border-border text-sm cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const data = String(reader.result || "");
                          const next = { ...user, avatar: data } as User;
                          setUser(next);
                          try {
                            const raw = localStorage.getItem("abc_users");
                            const db: DBUser[] = raw ? JSON.parse(raw) : [];
                            const idx = db.findIndex((x) => x.email === next.email);
                            if (idx >= 0) db[idx] = { ...db[idx], avatar: data };
                            localStorage.setItem("abc_users", JSON.stringify(db));
                            localStorage.setItem("abc_user", JSON.stringify(next));
                          } catch {}
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    Tải avatar
                  </label>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Họ và tên" className="px-3 py-2 rounded-lg border border-border" />
                  <input value={user.email} disabled className="px-3 py-2 rounded-lg border border-border" />
                  <input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Số điện thoại" className="px-3 py-2 rounded-lg border border-border" />
                  <input value={user.address || ""} onChange={(e) => setUser({ ...user, address: e.target.value })} placeholder="Địa chỉ" className="md:col-span-2 px-3 py-2 rounded-lg border border-border" />
                </div>
                <button
                  onClick={() => {
                    try {
                      localStorage.setItem("abc_user", JSON.stringify(user));
                      const rawUsers = localStorage.getItem("abc_users");
                      const db: DBUser[] = rawUsers ? JSON.parse(rawUsers) : [];
                      const idx = db.findIndex((x) => x.email === user.email);
                      if (idx >= 0) db[idx] = { ...db[idx], name: user.name, phone: user.phone, address: user.address, avatar: user.avatar };
                      localStorage.setItem("abc_users", JSON.stringify(db));
                    } catch {}
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
            {section === "orders" && (
              <div className="rounded-2xl border border-border p-4 bg-background/80 shadow-sm">
                <div className="text-xl font-semibold">Đơn hàng</div>
                <div className="mt-2 text-sm text-muted-foreground">Xem lịch sử đặt hàng và hủy đơn khi chưa xác thực.</div>
                <div className="mt-4 space-y-3">
                  {(() => {
                    try {
                      const raw = localStorage.getItem("abc_orders");
                      const orders: Order[] = raw ? JSON.parse(raw) : [];
                      const list = orders.filter((o) => (o.customer?.email && user.email && o.customer.email === user.email) || (o.customer?.phone && user.phone && o.customer.phone === user.phone));
                      if (list.length === 0) return <div className="text-sm text-muted-foreground">Chưa có đơn hàng.</div>;
                      return list.map((o) => (
                        <div key={o.id} className="rounded-xl border border-border p-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium">Đơn #{o.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">Ngày: {new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                            <div className="text-sm">Tổng: {o.total.toLocaleString('vi-VN')} đ</div>
                            <div className="text-sm">Trạng thái: {o.status || 'pending'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href="#" className="px-3 py-2 rounded-full border border-border text-sm">Chi tiết</a>
                            {(!o.status || o.status === 'pending') && (
                              <button
                                onClick={() => {
                                  try {
                                    const raw2 = localStorage.getItem("abc_orders");
                                    const ords: Order[] = raw2 ? JSON.parse(raw2) : [];
                                    const idx2 = ords.findIndex((x) => x.id === o.id);
                                    if (idx2 >= 0) ords[idx2] = { ...ords[idx2], status: 'cancelled' };
                                    localStorage.setItem("abc_orders", JSON.stringify(ords));
                                  } catch {}
                                }}
                                className="px-3 py-2 rounded-full bg-red-600 text-white text-sm"
                              >
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </div>
                      ));
                    } catch {
                      return <div className="text-sm text-muted-foreground">Không tải được đơn hàng.</div>;
                    }
                  })()}
                </div>
              </div>
            )}
            {section === "security" && (
              <div className="rounded-2xl border border-border p-4 bg-background/80 shadow-sm">
                <div className="text-xl font-semibold">Bảo mật</div>
                <div className="mt-2 text-sm text-muted-foreground">Đổi mật khẩu tài khoản của bạn.</div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu mới" className="px-3 py-2 rounded-lg border border-border" />
                </div>
                <button
                  onClick={() => {
                    try {
                      const rawUsers = localStorage.getItem("abc_users");
                      const db: DBUser[] = rawUsers ? JSON.parse(rawUsers) : [];
                      const idx = db.findIndex((x) => x.email === user.email);
                      if (idx >= 0) db[idx] = { ...db[idx], password };
                      localStorage.setItem("abc_users", JSON.stringify(db));
                      setMessage("Đã cập nhật mật khẩu");
                    } catch {}
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm"
                >
                  Cập nhật mật khẩu
                </button>
                {message && <div className="mt-2 text-sm text-muted-foreground">{message}</div>}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
