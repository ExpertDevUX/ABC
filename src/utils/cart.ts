export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
};

const KEY = "abc_cart";

export function getCart(): CartItem[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(items));
    try {
      window.dispatchEvent(new CustomEvent("abc_cart_changed"));
    } catch {}
  }
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === item.id && i.size === item.size);
  if (idx >= 0) cart[idx].qty += item.qty;
  else cart.push(item);
  saveCart(cart);
}

export function updateQty(id: string, qty: number, size?: string) {
  const cart = getCart()
    .map((i) => (i.id === id && (size ? i.size === size : true) ? { ...i, qty } : i))
    .filter((i) => i.qty > 0);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}
