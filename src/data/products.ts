export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  video?: string;
  category: "main" | "drink" | "dessert";
  isNew?: boolean;
  discountPercent?: number;
  sizes?: string[];
  views?: number;
  sold?: number;
};

export const products: Product[] = [
  {
    id: "phobo",
    name: "Phở bò đặc biệt",
    description: "Bánh phở mềm, nước dùng thơm, thịt bò tái chín",
    price: 55000,
    category: "main",
    discountPercent: 10,
    image: "/products/phobo.svg",
    images: ["/products/phobo.svg", "/products/placeholder.svg"],
    sizes: ["Nhỏ", "Vừa", "Lớn"],
    views: 920,
    sold: 310,
  },
  {
    id: "comga",
    name: "Cơm gà xối mỡ",
    description: "Cơm dẻo, gà giòn rụm, sốt đặc trưng",
    price: 60000,
    category: "main",
    isNew: true,
    image: "/products/comga.svg",
    images: ["/products/comga.svg", "/products/placeholder.svg"],
    sizes: ["Nhỏ", "Vừa", "Lớn"],
    views: 680,
    sold: 240,
  },
  {
    id: "burger",
    name: "Burger bò phô mai",
    description: "Bánh mềm, patty bò, phô mai tan chảy",
    price: 65000,
    category: "main",
    isNew: true,
    image: "/products/burger.svg",
    images: ["/products/burger.svg", "/products/placeholder.svg"],
    sizes: ["Nhỏ", "Vừa", "Lớn"],
    views: 800,
    sold: 275,
  },
  {
    id: "trasua",
    name: "Trà sữa trân châu",
    description: "Trà thơm, sữa béo, trân châu dai",
    price: 35000,
    category: "drink",
    discountPercent: 15,
    image: "/products/trasua.svg",
    images: ["/products/trasua.svg", "/products/placeholder.svg"],
    sizes: ["M", "L"],
    views: 1200,
    sold: 500,
  },
  {
    id: "cafe",
    name: "Cà phê sữa đá",
    description: "Đậm đà, béo thơm, mát lạnh",
    price: 30000,
    category: "drink",
    image: "/products/cafe.svg",
    images: ["/products/cafe.svg", "/products/placeholder.svg"],
    sizes: ["M", "L"],
    views: 1100,
    sold: 460,
  },
  {
    id: "nuocep",
    name: "Nước ép cam",
    description: "Tươi mát, giàu vitamin C",
    price: 32000,
    category: "drink",
    image: "/products/nuocep.svg",
    images: ["/products/nuocep.svg", "/products/placeholder.svg"],
    sizes: ["M", "L"],
    views: 700,
    sold: 210,
  },
  {
    id: "banhflan",
    name: "Bánh flan",
    description: "Mịn màng, thơm béo, caramel nhẹ",
    price: 28000,
    category: "dessert",
    isNew: true,
    image: "/products/banhflan.svg",
    images: ["/products/banhflan.svg", "/products/placeholder.svg"],
    sizes: ["1 phần"],
    views: 640,
    sold: 200,
  },
  {
    id: "kemvani",
    name: "Kem vani",
    description: "Mát lạnh, vị vani cổ điển",
    price: 25000,
    category: "dessert",
    image: "/products/kemvani.svg",
    images: ["/products/kemvani.svg", "/products/placeholder.svg"],
    sizes: ["1 viên", "2 viên"],
    views: 520,
    sold: 180,
  },
];
