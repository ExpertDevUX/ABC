export type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  topic?: string;
  content?: string;
};

export const posts: Post[] = [
  {
    id: "khai-truong",
    title: "Khai trương chi nhánh ABC Quận 7",
    excerpt: "Ưu đãi 20% cho tất cả món trong tuần đầu khai trương.",
    date: "2025-12-01",
    image: "/products/placeholder.svg",
    topic: "news",
    content: "ABC Restaurants chính thức khai trương chi nhánh Quận 7.\nTrong tuần đầu khai trương, toàn bộ món ăn đều giảm 20%.\nHãy đến trải nghiệm không gian mới và thực đơn đa dạng.",
  },
  {
    id: "combo-cuoi-tuan",
    title: "Combo cuối tuần siêu tiết kiệm",
    excerpt: "Combo 2 người chỉ từ 99.000đ, áp dụng thứ 6–CN.",
    date: "2025-12-05",
    image: "/products/placeholder.svg",
    topic: "promo",
    content: "Cuối tuần này, ABC giới thiệu combo tiết kiệm cho nhóm bạn và gia đình.\nMỗi combo gồm món chính, đồ uống và tráng miệng.\nÁp dụng từ thứ 6 đến Chủ nhật tại tất cả chi nhánh.",
  },
  {
    id: "thuc-don-giang-sinh",
    title: "Thực đơn Giáng Sinh đặc biệt",
    excerpt: "Thưởng thức món mới theo mùa cùng gia đình.",
    date: "2025-12-20",
    image: "/products/placeholder.svg",
    topic: "event",
    content: "Mùa lễ hội, ABC ra mắt thực đơn Giáng Sinh với các món theo mùa.\nTừ món chính ấm áp đến đồ tráng miệng ngọt ngào, phù hợp mọi lứa tuổi.\nĐặt bàn trước để có trải nghiệm trọn vẹn.",
  },
];
