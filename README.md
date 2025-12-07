# ABC Restaurants (Web)

Ứng dụng đặt món dành cho nhà hàng ABC, xây dựng với Next.js App Router, TypeScript và Tailwind CSS. Hỗ trợ giao diện cho người dùng và trang quản trị.

## Tính Năng
- Menu, giỏ hàng, thanh toán, bài viết, tìm kiếm.
- Trang quản trị: sản phẩm, đơn hàng, liên hệ, bài viết, chủ đề, danh mục, menu, banner, thành viên, cài đặt.

## Công Nghệ
- `Next.js 16` (App Router)
- `TypeScript`
- `Tailwind CSS`

## Cấu Hình Dữ Liệu
- Mặc định lưu bằng file JSON: `.data/users.json` sẽ được tạo tự động nếu chưa tồn tại.
- Có thể bật Postgres (Neon) bằng cách thiết lập biến môi trường:
  - `NEON_DATABASE_URL` hoặc `DATABASE_URL`
  - Khi đã cấu hình, hệ thống tự dùng Postgres và hash mật khẩu bằng `bcrypt`.

## API Base
- Base URL: `/api`

### Users
- `GET /api/users`
- `POST /api/users`
  - Body: `{ name, email, username?, password, role?, verified?, avatar?, phone?, address? }`
- `GET /api/users/{email}`
- `PUT /api/users/{email}`
- `DELETE /api/users/{email}`

### Auth
- `POST /api/auth/register`
  - Body: `{ name, email, password, username?, avatar?, phone?, address? }`
- `POST /api/auth/login`
  - Body: `{ identifier, password }` với `identifier` có thể là email/username/tên, và khi dùng Postgres có thể là số điện thoại (đã chuẩn hóa).

### Seed Mặc Định
- Nếu không có người dùng, hệ thống sẽ tạo tài khoản quản trị mặc định: `admin@abc.local` / `admin123`.

## Phát Triển
- Chạy dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Triển Khai
- Khi triển khai production, set `NEON_DATABASE_URL` để dùng Postgres.
- Chạy server: `npm start` sau khi build.
