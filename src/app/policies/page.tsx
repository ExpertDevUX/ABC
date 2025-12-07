export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Chính sách & Hướng dẫn</h1>
      <p className="mt-2 text-muted-foreground">Thông tin quan trọng về quyền lợi, trách nhiệm và hướng dẫn sử dụng dịch vụ ABC Restaurants.</p>

      <section className="mt-8 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Chính sách bảo mật</div>
        <div className="mt-2 text-sm text-muted-foreground">Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân.</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Thu thập: tên, email, số điện thoại, địa chỉ để xử lý đơn hàng.</li>
          <li>Sử dụng: phục vụ đặt hàng, chăm sóc khách hàng, cải thiện dịch vụ.</li>
          <li>Lưu trữ: dữ liệu được bảo vệ và chỉ dùng nội bộ.</li>
          <li>Chia sẻ: không chia sẻ với bên thứ ba, trừ khi có sự đồng ý hoặc yêu cầu pháp luật.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Điều khoản sử dụng</div>
        <div className="mt-2 text-sm text-muted-foreground">Khi sử dụng website, bạn đồng ý tuân thủ các quy định sau.</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Không đăng tải nội dung trái pháp luật, gây hại hoặc spam.</li>
          <li>Thông tin tài khoản phải chính xác, cập nhật và bảo mật.</li>
          <li>ABC có quyền thay đổi tính năng, tạm ngưng dịch vụ nếu cần thiết.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Chính sách đổi trả</div>
        <div className="mt-2 text-sm text-muted-foreground">Hỗ trợ đổi trả trong vòng 24h với sản phẩm lỗi hoặc không đúng mô tả.</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Điều kiện: sản phẩm còn nguyên vẹn, chụp ảnh chứng minh lỗi.</li>
          <li>Quy trình: liên hệ hotline, gửi thông tin đơn hàng và hình ảnh.</li>
          <li>Hoàn tiền: 3–5 ngày làm việc qua phương thức thanh toán ban đầu.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Hướng dẫn mua hàng</div>
        <ol className="mt-3 list-decimal pl-6 text-sm text-muted-foreground">
          <li>Duyệt menu theo danh mục.</li>
          <li>Chọn món, điều chỉnh kích thước/số lượng.</li>
          <li>Thêm vào giỏ và nhập mã giảm giá (nếu có).</li>
          <li>Thanh toán và theo dõi đơn tại mục Tài khoản.</li>
        </ol>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Phương thức thanh toán</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Thẻ nội địa/quốc tế.</li>
          <li>Ví điện tử.</li>
          <li>QR ngân hàng.</li>
          <li>Tiền mặt khi nhận (COD) tại một số khu vực.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Chính sách vận chuyển</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Khu vực: giao nhanh nội thành.</li>
          <li>Phí: hiển thị tại trang Giỏ hàng tùy theo địa chỉ.</li>
          <li>Thời gian: 30–90 phút tùy khu vực và thời điểm.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-6">
        <div className="text-xl font-semibold">Câu hỏi thường gặp (FAQ)</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Làm sao theo dõi đơn hàng?</div>
            <div className="mt-1 text-sm text-muted-foreground">Vào Tài khoản → Đơn hàng để xem trạng thái.</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Áp dụng mã giảm giá ở đâu?</div>
            <div className="mt-1 text-sm text-muted-foreground">Nhập tại Giỏ hàng, mục Mã giảm giá.</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Thời gian giao hàng?</div>
            <div className="mt-1 text-sm text-muted-foreground">Trung bình 30–90 phút tùy khu vực.</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-medium">Đổi món khi không ưng?</div>
            <div className="mt-1 text-sm text-muted-foreground">Liên hệ hotline trong 24h cùng hình ảnh minh chứng.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
