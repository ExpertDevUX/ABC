"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products as seedProducts } from "@/data/products";

type AdminUser = { name: string; email: string; username?: string; password: string; role?: string; verified?: boolean; avatar?: string };
type Product = { id: string; name: string; description: string; price: number; category: string; images?: string[]; options?: { name: string; values: string[] }[] };
type OrderItem = { id: string; name: string; price: number; qty: number };
type Order = { id: string; customer: { name: string; phone: string; address: string; email?: string }; items: OrderItem[]; total: number; status?: string; createdAt?: string };
type Contact = { id: string; name: string; email: string; subject: string; message: string; createdAt?: string; replied?: boolean };
type Post = { id: string; title: string; excerpt: string; date: string; image?: string; topic?: string; content?: string };
type Topic = { id: string; name: string };
type Promotion = { id: string; productId: string; discountPercent: number };
type StockEntry = { id: string; productId: string; qty: number; date: string; note?: string };
type MenuItem = { id: string; label: string; type: "category" | "topic" | "post" | "page" | "custom"; ref?: string; url?: string };
type Banner = { id: string; title: string; image: string; url?: string; active?: boolean };
type Settings = { siteName?: string; email?: string; phone?: string; hotline?: string; address?: string; logoUrl?: string };

export default function AdminPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem("abc_admin");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [section, setSection] = useState<string>("dashboard");

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("abc_admin_products");
      if (raw) return JSON.parse(raw);
      const seeded: Product[] = seedProducts.map((p) => ({ id: p.id, name: p.name, description: p.description, price: p.price, category: p.category, images: p.images || (p.image ? [p.image] : []), options: [] }));
      localStorage.setItem("abc_admin_products", JSON.stringify(seeded));
      return seeded;
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem("abc_orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const raw = localStorage.getItem("abc_contacts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem("abc_posts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const raw = localStorage.getItem("abc_topics");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [promos, setPromos] = useState<Promotion[]>(() => {
    try {
      const raw = localStorage.getItem("abc_promotions");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [stocks, setStocks] = useState<StockEntry[]>(() => {
    try {
      const raw = localStorage.getItem("abc_stock");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const raw = localStorage.getItem("abc_menu");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const raw = localStorage.getItem("abc_banners");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [members, setMembers] = useState<AdminUser[]>(() => {
    try {
      const raw = localStorage.getItem("abc_users");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [newMemberVerified, setNewMemberVerified] = useState<boolean>(true);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem("abc_settings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "abc_orders") {
        try {
          setOrders(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_contacts") {
        try {
          setContacts(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_admin_products") {
        try {
          setProducts(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_users") {
        try {
          setMembers(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_posts") {
        try {
          setPosts(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_topics") {
        try {
          setTopics(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_promotions") {
        try {
          setPromos(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_stock") {
        try {
          setStocks(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_menu") {
        try {
          setMenu(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_banners") {
        try {
          setBanners(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
      if (e.key === "abc_settings") {
        try {
          setSettings(e.newValue ? JSON.parse(e.newValue) : {});
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const list: AdminUser[] = await res.json();
          localStorage.setItem("abc_users", JSON.stringify(list));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (admin && section === "members") {
      (async () => {
        try {
          const res = await fetch("/api/users");
          if (res.ok) {
            const list: AdminUser[] = await res.json();
            setMembers(list);
            localStorage.setItem("abc_users", JSON.stringify(list));
          }
        } catch {}
      })();
    }
  }, [admin, section]);

  useEffect(() => {
    if (!admin) return;
    (async () => {
      try {
        if (apiBase && section === "posts") {
          const res = await fetch(`${apiBase}/posts`);
          if (res.ok) {
            const list = await res.json();
            setPosts(Array.isArray(list) ? list : []);
            localStorage.setItem("abc_posts", JSON.stringify(Array.isArray(list) ? list : []));
          }
        }
        if (apiBase && (section === "posts" || section === "topics")) {
          const resT = await fetch(`${apiBase}/topics`);
          if (resT.ok) {
            const listT = await resT.json();
            setTopics(Array.isArray(listT) ? listT : []);
            localStorage.setItem("abc_topics", JSON.stringify(Array.isArray(listT) ? listT : []));
          }
        }
      } catch {}
    })();
  }, [admin, section, apiBase]);

  const revenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  

  function login() {
    setLoginMsg("");
    const id = identifier.trim().toLowerCase();
    if (!id || !password) {
      setLoginMsg("Vui lòng nhập thông tin đăng nhập");
      return;
    }
    try {
      const raw = localStorage.getItem("abc_users");
      const db: AdminUser[] = raw ? JSON.parse(raw) : [];
      const u = db.find((x) => (x.email || "").toLowerCase() === id || (x.username || "").toLowerCase() === id);
      if (!u) {
        setLoginMsg("Tài khoản không tồn tại");
        return;
      }
      if (u.password !== password) {
        setLoginMsg("Mật khẩu không chính xác");
        return;
      }
      if ((u.role || "") !== "admin") {
        setLoginMsg("Tài khoản không có quyền");
        return;
      }
      if (u.verified === false) {
        setLoginMsg("Tài khoản chưa xác thực");
        return;
      }
      localStorage.setItem("abc_admin", JSON.stringify(u));
      setAdmin(u);
      setSection("dashboard");
    } catch {
      setLoginMsg("Có lỗi xảy ra");
    }
  }

  function logout() {
    localStorage.removeItem("abc_admin");
    setAdmin(null);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Quản trị</h1>
      {!admin ? (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl border border-border p-6">
            <div className="text-xl font-semibold">Đăng nhập quản trị</div>
            <div className="mt-4 grid gap-3">
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email / Tên đăng nhập" className="px-3 py-2 rounded-lg border border-border" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="px-3 py-2 rounded-lg border border-border" />
              <button onClick={login} className="mt-2 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Đăng nhập</button>
              {loginMsg && <div className="text-sm text-muted-foreground">{loginMsg}</div>}
            </div>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="text-base font-semibold">Hướng dẫn</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Tài khoản admin phải có role = admin</li>
              <li>Quản lý dữ liệu sử dụng bộ nhớ trình duyệt</li>
            </ul>
          </div>
        </section>
      ) : (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 rounded-2xl border border-border p-4 h-fit">
            <div className="text-base font-semibold">Xin chào</div>
            <div className="mt-1 text-sm text-muted-foreground">{admin.name}</div>
            <div className="mt-3 grid gap-2 text-sm">
              {["dashboard","products","stock","promotions","categories","orders","posts","topics","contacts","menu","banners","members","settings"].map((key) => (
                <button key={key} onClick={() => setSection(key)} className={`px-3 py-2 rounded-lg border border-border text-left transition-colors ${section === key ? "bg-brand text-brand-contrast border-brand" : "hover:bg-muted"}`}>{
                  key === "dashboard" ? "Tổng quan" :
                  key === "products" ? "Sản phẩm" :
                  key === "stock" ? "Nhập kho" :
                  key === "promotions" ? "Khuyến mãi" :
                  key === "categories" ? "Danh mục" :
                  key === "orders" ? "Đơn hàng" :
                  key === "posts" ? "Bài viết" :
                  key === "topics" ? "Chủ đề" :
                  key === "contacts" ? "Liên hệ" :
                  key === "menu" ? "Menu" :
                  key === "banners" ? "Banner" :
                  key === "members" ? "Thành viên" :
                  "Cài đặt"
                }</button>
              ))}
              <button onClick={logout} className="mt-2 px-3 py-2 rounded-lg border border-border">Đăng xuất</button>
            </div>
          </aside>
          <div className="md:col-span-3 rounded-2xl border border-border p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/15 dark:to-red-900/15 shadow-sm">
            <div className="md:hidden -mt-2 mb-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                {[
                  "dashboard",
                  "products",
                  "orders",
                  "topics",
                  "contacts",
                  "menu",
                  "banners",
                  "members",
                  "settings",
                ].map((key) => (
                  <button
                    key={key}
                    onClick={() => setSection(key)}
                    className={`px-3 py-2 rounded-full border text-sm whitespace-nowrap ${
                      section === key ? "bg-brand text-brand-contrast border-brand" : "border-border"
                    }`}
                  >
                    {key === "dashboard" ? "Tổng quan" :
                     key === "products" ? "Sản phẩm" :
                     key === "orders" ? "Đơn hàng" :
                     key === "topics" ? "Chủ đề" :
                     key === "contacts" ? "Liên hệ" :
                     key === "menu" ? "Menu" :
                     key === "banners" ? "Banner" :
                     key === "members" ? "Thành viên" :
                     "Cài đặt"}
                  </button>
                ))}
              </div>
            </div>
            {section === "dashboard" && (
              <div>
                {(() => {
                  const days = Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().slice(0, 10);
                  });
                  const byDay = (dateStr: string) => orders.filter((o) => (o.createdAt || "").slice(0,10) === dateStr);
                  const ordersSeries = days.map((d) => byDay(d).length);
                  const revenueSeries = days.map((d) => byDay(d).reduce((s, o) => s + (o.total || 0), 0));
                  const maxOrders = Math.max(1, ...ordersSeries);
                  const maxRevenue = Math.max(1, ...revenueSeries);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border p-4 bg-background/70">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Đơn hàng (7 ngày)</div>
                            <div className="mt-1 text-2xl font-semibold">{orders.length}</div>
                          </div>
                        </div>
                        <div className="mt-4 h-24 flex items-end gap-2">
                          {ordersSeries.map((v, idx) => (
                            <div key={idx} className="flex-1 bg-brand/30 rounded-md" style={{ height: `${Math.round((v / maxOrders) * 100)}%` }} />
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                          {days.map((d, idx) => (<span key={idx}>{d.slice(5)}</span>))}
                        </div>
                      </div>
                      <div className="rounded-xl border p-4 bg-background/70">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Doanh thu (7 ngày)</div>
                            <div className="mt-1 text-2xl font-semibold">{revenue.toLocaleString('vi-VN')} đ</div>
                          </div>
                        </div>
                        <div className="mt-4 h-24 flex items-end gap-2">
                          {revenueSeries.map((v, idx) => (
                            <div key={idx} className="flex-1 bg-green-500/40 rounded-md" style={{ height: `${Math.round((v / maxRevenue) * 100)}%` }} />
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                          {days.map((d, idx) => (<span key={idx}>{d.slice(5)}</span>))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {section === "products" && (
              <div>
                <div className="text-xl font-semibold">Quản lý sản phẩm</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Tìm sản phẩm" className="px-3 py-2 rounded-lg border border-border" onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    const raw = localStorage.getItem("abc_admin_products");
                    const base: Product[] = raw ? JSON.parse(raw) : [];
                    setProducts(base.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q)));
                  }} />
                  <select onChange={(e) => {
                    const cat = e.target.value;
                    const raw = localStorage.getItem("abc_admin_products");
                    const base: Product[] = raw ? JSON.parse(raw) : [];
                    setProducts(cat === "all" ? base : base.filter((p) => p.category === cat));
                  }} className="px-3 py-2 rounded-lg border border-border text-sm">
                    <option value="all">Tất cả</option>
                    <option value="main">Món chính</option>
                    <option value="drink">Đồ uống</option>
                    <option value="dessert">Tráng miệng</option>
                  </select>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm sản phẩm</div>
                    <div className="mt-3 grid gap-2">
                      <input id="p_name" placeholder="Tên" className="px-3 py-2 rounded-lg border border-border" />
                      <input id="p_desc" placeholder="Mô tả" className="px-3 py-2 rounded-lg border border-border" />
                      <input id="p_price" placeholder="Giá" type="number" className="px-3 py-2 rounded-lg border border-border" />
                      <select id="p_cat" className="px-3 py-2 rounded-lg border border-border text-sm"><option value="main">Món chính</option><option value="drink">Đồ uống</option><option value="dessert">Tráng miệng</option></select>
                      <button onClick={() => {
                        const name = (document.getElementById("p_name") as HTMLInputElement)?.value || "";
                        const description = (document.getElementById("p_desc") as HTMLInputElement)?.value || "";
                        const price = Number((document.getElementById("p_price") as HTMLInputElement)?.value || 0);
                        const category = (document.getElementById("p_cat") as HTMLSelectElement)?.value || "main";
                        if (!name || price <= 0) return;
                        const next: Product = { id: crypto.randomUUID(), name, description, price, category, images: [], options: [] };
                        const raw = localStorage.getItem("abc_admin_products");
                        const list: Product[] = raw ? JSON.parse(raw) : [];
                        list.push(next);
                        localStorage.setItem("abc_admin_products", JSON.stringify(list));
                        setProducts(list);
                      }} className="px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {products.map((p) => (
                        <div key={p.id} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-muted-foreground">{p.price.toLocaleString('vi-VN')} đ • {p.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => {
                                const name = prompt("Tên", p.name) || p.name;
                                const description = prompt("Mô tả", p.description) || p.description;
                                const priceStr = prompt("Giá", String(p.price)) || String(p.price);
                                const price = Number(priceStr) || p.price;
                                const list = products.map((x) => x.id === p.id ? { ...x, name, description, price } : x);
                                localStorage.setItem("abc_admin_products", JSON.stringify(list));
                                setProducts(list);
                              }} className="px-2 py-1 rounded-full border border-border text-xs">Sửa</button>
                              <button onClick={() => {
                                const list = products.filter((x) => x.id !== p.id);
                                localStorage.setItem("abc_admin_products", JSON.stringify(list));
                                setProducts(list);
                              }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => {
                              const url = prompt("Ảnh URL") || "";
                              if (!url) return;
                              const list = products.map((x) => x.id === p.id ? { ...x, images: [...(x.images || []), url] } : x);
                              localStorage.setItem("abc_admin_products", JSON.stringify(list));
                              setProducts(list);
                            }} className="px-2 py-1 rounded-full border border-border text-xs">Thêm ảnh</button>
                            <button onClick={() => {
                              const nameOpt = prompt("Tên tuỳ chọn") || "";
                              if (!nameOpt) return;
                              const valuesStr = prompt("Giá trị (phân tách bằng ,)") || "";
                              const values = valuesStr.split(",").map((s) => s.trim()).filter((s) => s);
                              const list = products.map((x) => x.id === p.id ? { ...x, options: [...(x.options || []), { name: nameOpt, values }] } : x);
                              localStorage.setItem("abc_admin_products", JSON.stringify(list));
                              setProducts(list);
                            }} className="px-2 py-1 rounded-full border border-border text-xs">Thêm tuỳ chọn</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "orders" && (
              <div>
                <div className="text-xl font-semibold">Quản lý đơn hàng</div>
                <div className="mt-3 space-y-2">
                  {orders.slice().reverse().map((o) => (
                    <div key={o.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Đơn #{o.id.slice(0,8)}</div>
                        <div className="text-sm">{(o.total || 0).toLocaleString('vi-VN')} đ</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{o.customer.name} • {o.customer.phone} • {o.customer.address}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <select value={o.status || 'pending'} onChange={(e) => {
                          const next = orders.map((x) => x.id === o.id ? { ...x, status: e.target.value } : x);
                          localStorage.setItem("abc_orders", JSON.stringify(next));
                          setOrders(next);
                        }} className="px-3 py-2 rounded-lg border border-border text-sm">
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="shipped">shipped</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <button onClick={() => alert(JSON.stringify(o.items))} className="px-3 py-2 rounded-full border border-border text-sm">Xem chi tiết</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section === "contacts" && (
              <div>
                <div className="text-xl font-semibold">Quản lý liên hệ</div>
                <div className="mt-3 space-y-2">
                  {contacts.slice().reverse().map((c) => (
                    <div key={c.id} className="rounded-lg border p-3">
                      <div className="font-medium">{c.subject}</div>
                      <div className="text-sm text-muted-foreground">{c.name} • {c.email}</div>
                      <div className="mt-1 text-sm">{c.message}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => {
                          try {
                            const outboxRaw = localStorage.getItem("abc_outbox");
                            const outbox = outboxRaw ? JSON.parse(outboxRaw) : [];
                            outbox.push({ to: c.email, subject: "Phản hồi liên hệ", refId: c.id, date: new Date().toISOString() });
                            localStorage.setItem("abc_outbox", JSON.stringify(outbox));
                            const next = contacts.map((x) => x.id === c.id ? { ...x, replied: true } : x);
                            localStorage.setItem("abc_contacts", JSON.stringify(next));
                            setContacts(next);
                          } catch {}
                        }} className="px-3 py-2 rounded-full border border-border text-sm">Trả lời</button>
                        <button onClick={() => {
                          const next = contacts.filter((x) => x.id !== c.id);
                          localStorage.setItem("abc_contacts", JSON.stringify(next));
                          setContacts(next);
                        }} className="px-3 py-2 rounded-full bg-red-600 text-white text-sm">Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section === "posts" && (
              <div>
                <div className="text-xl font-semibold">Quản lý bài viết</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm bài viết</div>
                    <input id="b_title" placeholder="Tiêu đề" className="mt-3 px-3 py-2 rounded-lg border border-border" />
                    <input id="b_excerpt" placeholder="Trích" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <input id="b_image" placeholder="Ảnh (URL)" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <input id="b_image_file" type="file" accept="image/*" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <select id="b_topic" className="mt-2 px-3 py-2 rounded-lg border border-border text-sm">{(topics.length > 0 ? topics.map((t) => (<option key={t.id} value={t.name}>{t.name}</option>)) : ["news","promo","event"].map((t) => (<option key={t} value={t}>{t}</option>)))}</select>
                    <textarea id="b_content" placeholder="Nội dung" className="mt-2 h-24 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const title = (document.getElementById("b_title") as HTMLInputElement)?.value || "";
                      const excerpt = (document.getElementById("b_excerpt") as HTMLInputElement)?.value || "";
                      const image = (document.getElementById("b_image") as HTMLInputElement)?.value || "";
                      const topic = (document.getElementById("b_topic") as HTMLSelectElement)?.value || "news";
                      const content = (document.getElementById("b_content") as HTMLTextAreaElement)?.value || "";
                      const fEl = document.getElementById("b_image_file") as HTMLInputElement | null;
                      const f = fEl?.files?.[0];
                      if (!title) return;
                      (async () => {
                        try {
                          let imgUrl = image;
                          if (!imgUrl && f) {
                            const form = new FormData();
                            form.append("file", f);
                            const up = await fetch("/api/upload", { method: "POST", body: form });
                            if (up.ok) {
                              const data = await up.json();
                              imgUrl = data.url;
                            }
                          }
                          const next: Post = { id: crypto.randomUUID(), title, excerpt, image: imgUrl, topic, date: new Date().toISOString(), content };
                          if (apiBase) {
                            const res = await fetch(`${apiBase}/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                            if (res.ok) {
                              const created = await res.json();
                              const list = [...posts, created];
                              setPosts(list);
                              localStorage.setItem("abc_posts", JSON.stringify(list));
                              if (fEl) fEl.value = "";
                              (document.getElementById("b_title") as HTMLInputElement).value = "";
                              (document.getElementById("b_excerpt") as HTMLInputElement).value = "";
                              (document.getElementById("b_image") as HTMLInputElement).value = "";
                              (document.getElementById("b_content") as HTMLTextAreaElement).value = "";
                            }
                          } else {
                            const raw = localStorage.getItem("abc_posts");
                            const list: Post[] = raw ? JSON.parse(raw) : [];
                            list.push(next);
                            localStorage.setItem("abc_posts", JSON.stringify(list));
                            setPosts(list);
                            if (fEl) fEl.value = "";
                            (document.getElementById("b_title") as HTMLInputElement).value = "";
                            (document.getElementById("b_excerpt") as HTMLInputElement).value = "";
                            (document.getElementById("b_image") as HTMLInputElement).value = "";
                            (document.getElementById("b_content") as HTMLTextAreaElement).value = "";
                          }
                        } catch {}
                      })();
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {posts.map((b) => (
                        <div key={b.id} className="rounded-lg border p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{b.title}</div>
                            <div className="text-sm text-muted-foreground">{b.topic || ""}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              const title = prompt("Tiêu đề", b.title) || b.title;
                              const excerpt = prompt("Trích", b.excerpt || "") || b.excerpt || "";
                              const image = prompt("Ảnh (URL)", b.image || "") || b.image || "";
                              const topic = prompt("Chủ đề", b.topic || "") || b.topic || "";
                              const content = prompt("Nội dung", b.content || "") || b.content || "";
                              const next = { ...b, title, excerpt, image, topic, content };
                              (async () => {
                                try {
                                  if (apiBase) {
                                    const res = await fetch(`${apiBase}/posts/${encodeURIComponent(b.id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                                    if (res.ok) {
                                      const updated = await res.json();
                                      const list = posts.map((x) => x.id === b.id ? updated : x);
                                      setPosts(list);
                                      localStorage.setItem("abc_posts", JSON.stringify(list));
                                    }
                                  } else {
                                    const list = posts.map((x) => x.id === b.id ? next : x);
                                    localStorage.setItem("abc_posts", JSON.stringify(list));
                                    setPosts(list);
                                  }
                                } catch {}
                              })();
                            }} className="px-2 py-1 rounded-full border border-border text-xs">Sửa</button>
                            <button onClick={() => {
                              (async () => {
                                try {
                                  if (apiBase) {
                                    const res = await fetch(`${apiBase}/posts/${encodeURIComponent(b.id)}`, { method: "DELETE" });
                                    if (res.ok) {
                                      const list = posts.filter((x) => x.id !== b.id);
                                      setPosts(list);
                                      localStorage.setItem("abc_posts", JSON.stringify(list));
                                    }
                                  } else {
                                    const list = posts.filter((x) => x.id !== b.id);
                                    localStorage.setItem("abc_posts", JSON.stringify(list));
                                    setPosts(list);
                                  }
                                } catch {}
                              })();
                            }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "topics" && (
              <div>
                <div className="text-xl font-semibold">Quản lý chủ đề bài viết</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm chủ đề</div>
                    <input id="t_name" placeholder="Tên chủ đề" className="mt-3 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const name = (document.getElementById("t_name") as HTMLInputElement)?.value || "";
                      if (!name) return;
                      const next: Topic = { id: crypto.randomUUID(), name };
                      (async () => {
                        try {
                          if (apiBase) {
                            const res = await fetch(`${apiBase}/topics`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                            if (res.ok) {
                              const created = await res.json();
                              const list = [...topics, created];
                              setTopics(list);
                              localStorage.setItem("abc_topics", JSON.stringify(list));
                              (document.getElementById("t_name") as HTMLInputElement).value = "";
                            }
                          } else {
                            const raw = localStorage.getItem("abc_topics");
                            const list: Topic[] = raw ? JSON.parse(raw) : [];
                            list.push(next);
                            localStorage.setItem("abc_topics", JSON.stringify(list));
                            setTopics(list);
                            (document.getElementById("t_name") as HTMLInputElement).value = "";
                          }
                        } catch {}
                      })();
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {topics.map((t) => (
                        <div key={t.id} className="rounded-lg border p-3 flex items-center justify-between">
                          <div className="font-medium">{t.name}</div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              const name = prompt("Tên", t.name) || t.name;
                              (async () => {
                                try {
                                  if (apiBase) {
                                    const res = await fetch(`${apiBase}/topics/${encodeURIComponent(t.id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...t, name }) });
                                    if (res.ok) {
                                      const updated = await res.json();
                                      const list = topics.map((x) => x.id === t.id ? updated : x);
                                      localStorage.setItem("abc_topics", JSON.stringify(list));
                                      setTopics(list);
                                    }
                                  } else {
                                    const list = topics.map((x) => x.id === t.id ? { ...x, name } : x);
                                    localStorage.setItem("abc_topics", JSON.stringify(list));
                                    setTopics(list);
                                  }
                                } catch {}
                              })();
                            }} className="px-2 py-1 rounded-full border border-border text-xs">Sửa</button>
                            <button onClick={() => {
                              (async () => {
                                try {
                                  if (apiBase) {
                                    const res = await fetch(`${apiBase}/topics/${encodeURIComponent(t.id)}`, { method: "DELETE" });
                                    if (res.ok) {
                                      const list = topics.filter((x) => x.id !== t.id);
                                      localStorage.setItem("abc_topics", JSON.stringify(list));
                                      setTopics(list);
                                    }
                                  } else {
                                    const list = topics.filter((x) => x.id !== t.id);
                                    localStorage.setItem("abc_topics", JSON.stringify(list));
                                    setTopics(list);
                                  }
                                } catch {}
                              })();
                            }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "promotions" && (
              <div>
                <div className="text-xl font-semibold">Quản lý khuyến mãi</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Tạo khuyến mãi</div>
                    <select id="pm_pid" className="mt-3 px-3 py-2 rounded-lg border border-border text-sm">
                      {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                    <input id="pm_pct" type="number" placeholder="Phần trăm" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const productId = (document.getElementById("pm_pid") as HTMLSelectElement)?.value || "";
                      const pct = Number((document.getElementById("pm_pct") as HTMLInputElement)?.value || 0);
                      if (!productId || pct <= 0) return;
                      const next: Promotion = { id: crypto.randomUUID(), productId, discountPercent: pct };
                      const raw = localStorage.getItem("abc_promotions");
                      const list: Promotion[] = raw ? JSON.parse(raw) : [];
                      list.push(next);
                      localStorage.setItem("abc_promotions", JSON.stringify(list));
                      setPromos(list);
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {promos.map((m) => {
                        const p = products.find((x) => x.id === m.productId);
                        return (
                          <div key={m.id} className="rounded-lg border p-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p?.name || m.productId}</div>
                              <div className="text-sm text-muted-foreground">-{m.discountPercent}%</div>
                            </div>
                            <button onClick={() => {
                              const list = promos.filter((x) => x.id !== m.id);
                              localStorage.setItem("abc_promotions", JSON.stringify(list));
                              setPromos(list);
                            }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "stock" && (
              <div>
                <div className="text-xl font-semibold">Quản lý nhập kho</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Tạo phiếu nhập</div>
                    <select id="st_pid" className="mt-3 px-3 py-2 rounded-lg border border-border text-sm">
                      {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                    <input id="st_qty" type="number" placeholder="Số lượng" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <input id="st_note" placeholder="Ghi chú" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const productId = (document.getElementById("st_pid") as HTMLSelectElement)?.value || "";
                      const qty = Number((document.getElementById("st_qty") as HTMLInputElement)?.value || 0);
                      const note = (document.getElementById("st_note") as HTMLInputElement)?.value || "";
                      if (!productId || qty <= 0) return;
                      const next: StockEntry = { id: crypto.randomUUID(), productId, qty, note, date: new Date().toISOString() };
                      const raw = localStorage.getItem("abc_stock");
                      const list: StockEntry[] = raw ? JSON.parse(raw) : [];
                      list.push(next);
                      localStorage.setItem("abc_stock", JSON.stringify(list));
                      setStocks(list);
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách nhập kho</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {stocks.slice().reverse().map((s) => {
                        const p = products.find((x) => x.id === s.productId);
                        return (
                          <div key={s.id} className="rounded-lg border p-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p?.name || s.productId}</div>
                              <div className="text-sm text-muted-foreground">SL: {s.qty} • {new Date(s.date).toLocaleString()}</div>
                            </div>
                            <button onClick={() => {
                              const list = stocks.filter((x) => x.id !== s.id);
                              localStorage.setItem("abc_stock", JSON.stringify(list));
                              setStocks(list);
                            }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "categories" && (
              <div>
                <div className="text-xl font-semibold">Quản lý danh mục</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm danh mục</div>
                    <input id="c_name" placeholder="Tên danh mục" className="mt-3 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const name = (document.getElementById("c_name") as HTMLInputElement)?.value || "";
                      if (!name) return;
                      const next = { id: crypto.randomUUID(), name } as { id: string; name: string };
                      const raw = localStorage.getItem("abc_categories");
                      const list: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
                      list.push(next);
                      localStorage.setItem("abc_categories", JSON.stringify(list));
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {(() => {
                        try {
                          const raw = localStorage.getItem("abc_categories");
                          const list: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
                          return list.map((t) => (
                            <div key={t.id} className="rounded-lg border p-3 flex items-center justify-between">
                              <div className="font-medium">{t.name}</div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => {
                                  const name = prompt("Tên", t.name) || t.name;
                                  const next = list.map((x) => x.id === t.id ? { ...x, name } : x);
                                  localStorage.setItem("abc_categories", JSON.stringify(next));
                                }} className="px-2 py-1 rounded-full border border-border text-xs">Sửa</button>
                                <button onClick={() => {
                                  const next = list.filter((x) => x.id !== t.id);
                                  localStorage.setItem("abc_categories", JSON.stringify(next));
                                }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                              </div>
                            </div>
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "menu" && (
              <div>
                <div className="text-xl font-semibold">Quản lý menu</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm menu</div>
                    <input id="m_label" placeholder="Nhãn" className="mt-3 px-3 py-2 rounded-lg border border-border" />
                    <select id="m_type" className="mt-2 px-3 py-2 rounded-lg border border-border text-sm">
                      {(["category","topic","post","page","custom"] as MenuItem["type"][ ]).map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                    <input id="m_ref" placeholder="Tham chiếu/URL" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const label = (document.getElementById("m_label") as HTMLInputElement)?.value || "";
                      const type = (document.getElementById("m_type") as HTMLSelectElement)?.value as MenuItem["type"];
                      const ref = (document.getElementById("m_ref") as HTMLInputElement)?.value || "";
                      if (!label) return;
                      const next: MenuItem = { id: crypto.randomUUID(), label, type, ref: ref || undefined, url: type === "custom" ? ref : undefined };
                      const raw = localStorage.getItem("abc_menu");
                      const list: MenuItem[] = raw ? JSON.parse(raw) : [];
                      list.push(next);
                      localStorage.setItem("abc_menu", JSON.stringify(list));
                      setMenu(list);
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {menu.map((m) => (
                        <div key={m.id} className="rounded-lg border p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{m.label}</div>
                            <div className="text-sm text-muted-foreground">{m.type}</div>
                          </div>
                          <button onClick={() => {
                            const list = menu.filter((x) => x.id !== m.id);
                            localStorage.setItem("abc_menu", JSON.stringify(list));
                            setMenu(list);
                          }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "banners" && (
              <div>
                <div className="text-xl font-semibold">Quản lý banner</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Thêm banner</div>
                    <input id="bn_title" placeholder="Tiêu đề" className="mt-3 px-3 py-2 rounded-lg border border-border" />
                    <input id="bn_image" placeholder="Ảnh" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <input id="bn_url" placeholder="Liên kết" className="mt-2 px-3 py-2 rounded-lg border border-border" />
                    <button onClick={() => {
                      const title = (document.getElementById("bn_title") as HTMLInputElement)?.value || "";
                      const image = (document.getElementById("bn_image") as HTMLInputElement)?.value || "";
                      const url = (document.getElementById("bn_url") as HTMLInputElement)?.value || "";
                      if (!title || !image) return;
                      const next: Banner = { id: crypto.randomUUID(), title, image, url };
                      const raw = localStorage.getItem("abc_banners");
                      const list: Banner[] = raw ? JSON.parse(raw) : [];
                      list.push(next);
                      localStorage.setItem("abc_banners", JSON.stringify(list));
                      setBanners(list);
                    }} className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm">Thêm</button>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-base font-semibold">Danh sách</div>
                    <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                      {banners.map((b) => (
                        <div key={b.id} className="rounded-lg border p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{b.title}</div>
                            <div className="text-sm text-muted-foreground">{b.url || ""}</div>
                          </div>
                          <button onClick={() => {
                            const list = banners.filter((x) => x.id !== b.id);
                            localStorage.setItem("abc_banners", JSON.stringify(list));
                            setBanners(list);
                          }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === "members" && (
              <div>
                <div className="text-xl font-semibold">Quản lý thành viên</div>
                <div className="mt-3 rounded-xl border p-4">
                  <div className="text-base font-semibold">Thêm thành viên</div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="Tên" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={newMemberUsername} onChange={(e) => setNewMemberUsername(e.target.value)} placeholder="Tên đăng nhập" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={newMemberPassword} onChange={(e) => setNewMemberPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="px-3 py-2 rounded-lg border border-border" />
                    <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm">
                      <option value="">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={newMemberVerified} onChange={(e) => setNewMemberVerified(e.target.checked)} />
                      Đã xác thực
                    </label>
                    <input id="m_avatar" type="file" accept="image/*" className="px-3 py-2 rounded-lg border border-border" />
                  </div>
                  <button
                    onClick={async () => {
                      type NewUserPayload = { name: string; email: string; username?: string; password: string; role?: string; verified?: boolean; avatar?: string };
                      const payload: NewUserPayload = { name: newMemberName.trim(), email: newMemberEmail.trim(), username: newMemberUsername.trim(), password: newMemberPassword, role: newMemberRole || undefined, verified: newMemberVerified };
                      const el = document.getElementById("m_avatar") as HTMLInputElement | null;
                      const f = el?.files?.[0];
                      if (f) {
                        const form = new FormData();
                        form.append("file", f);
                        try {
                          const up = await fetch("/api/upload", { method: "POST", body: form });
                          if (up.ok) {
                            const data = await up.json();
                            payload.avatar = data.url;
                          }
                        } catch {}
                      }
                      if (!payload.name || !payload.email || !payload.password) return;
                      try {
                        const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                        if (res.ok) {
                          const created = await res.json();
                          const next = [...members, created];
                          setMembers(next);
                          localStorage.setItem("abc_users", JSON.stringify(next));
                          setNewMemberName(""); setNewMemberEmail(""); setNewMemberUsername(""); setNewMemberPassword(""); setNewMemberRole(""); setNewMemberVerified(true);
                          if (el) el.value = "";
                        }
                      } catch {}
                    }}
                    className="mt-3 px-4 py-2 rounded-full bg-brand text-brand-contrast text-sm"
                  >
                    Thêm
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-96 overflow-auto">
                  {members.map((m) => (
                    <div key={`${m.email}`} className="rounded-lg border p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-border">
                          {m.avatar ? <Image src={m.avatar} alt={m.name} fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs">{(m.name || "").slice(0,1).toUpperCase() || "U"}</div>}
                        </div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-muted-foreground">{m.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={m.role || ''} onChange={async (e) => {
                          const role = e.target.value;
                          try {
                            const res = await fetch(`/api/users/${encodeURIComponent(m.email)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
                            if (res.ok) {
                              const updated = await res.json();
                              const list = members.map((x) => x.email === m.email ? updated : x);
                              setMembers(list);
                              localStorage.setItem("abc_users", JSON.stringify(list));
                            }
                          } catch {}
                        }} className="px-3 py-2 rounded-lg border border-border text-sm">
                          <option value="">user</option>
                          <option value="admin">admin</option>
                        </select>
                        <label className="px-3 py-2 rounded-full border border-border text-xs cursor-pointer">
                          <input id={`av_${m.email}`} type="file" accept="image/*" className="hidden" onChange={async (ev) => {
                            const f = (ev.target as HTMLInputElement).files?.[0];
                            if (!f) return;
                            const form = new FormData();
                            form.append("file", f);
                            try {
                              const up = await fetch("/api/upload", { method: "POST", body: form });
                              if (up.ok) {
                                const data = await up.json();
                                const res = await fetch(`/api/users/${encodeURIComponent(m.email)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: data.url }) });
                                if (res.ok) {
                                  const updated = await res.json();
                                  const list = members.map((x) => x.email === m.email ? updated : x);
                                  setMembers(list);
                                  localStorage.setItem("abc_users", JSON.stringify(list));
                                }
                              }
                            } catch {}
                          }} />
                          Upload avatar
                        </label>
                        <button onClick={async () => {
                          try {
                            const res = await fetch(`/api/users/${encodeURIComponent(m.email)}`, { method: "DELETE" });
                            if (res.ok) {
                              const list = members.filter((x) => x.email !== m.email);
                              setMembers(list);
                              localStorage.setItem("abc_users", JSON.stringify(list));
                            }
                          } catch {}
                        }} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section === "settings" && (
              <div>
                <div className="text-xl font-semibold">Cài đặt website</div>
                <div className="mt-2 text-sm text-muted-foreground">Quản lý thông tin liên hệ và logo thương hiệu.</div>
                <div className="mt-3 rounded-2xl border border-border p-4 bg-background/80 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} placeholder="Tên website" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="Email" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={settings.hotline || ""} onChange={(e) => setSettings({ ...settings, hotline: e.target.value })} placeholder="Hotline" className="px-3 py-2 rounded-lg border border-border" />
                    <input value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Address" className="md:col-span-2 px-3 py-2 rounded-lg border border-border" />
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-border p-4 bg-background/80 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div className="md:col-span-1">
                      <div className="text-sm font-medium">Logo hiện tại</div>
                      <div className="mt-2 h-16 w-16 rounded-xl border border-border overflow-hidden bg-background flex items-center justify-center relative">
                        {settings.logoUrl ? <Image src={settings.logoUrl} alt="logo" fill className="object-cover" /> : <span className="text-xl">🍽️</span>}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <input id="logo_file" type="file" accept="image/*" className="w-full px-3 py-2 rounded-lg border border-border" />
                      <button
                        onClick={async () => {
                          const el = document.getElementById("logo_file") as HTMLInputElement | null;
                          const f = el?.files?.[0];
                          if (!f) return;
                          const form = new FormData();
                          form.append("file", f);
                          try {
                            const res = await fetch("/api/upload", { method: "POST", body: form });
                            if (res.ok) {
                              const data = await res.json();
                              const next = { ...settings, logoUrl: data.url };
                              setSettings(next);
                              localStorage.setItem("abc_settings", JSON.stringify(next));
                            }
                          } catch {}
                        }}
                        className="mt-2 px-4 py-2 rounded-full border border-border text-sm"
                      >
                        Tải logo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => { localStorage.setItem("abc_settings", JSON.stringify(settings)); }} className="px-5 py-2 rounded-full bg-brand text-brand-contrast text-sm shadow">Lưu thay đổi</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
