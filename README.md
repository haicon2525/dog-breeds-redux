# Dog Breeds Explorer (React + Redux Toolkit + Offline Handling)

Dự án React hoàn chỉnh đáp ứng bài tập thực hành Redux với khả năng xử lý ngoại tuyến (Offline-First).

## Đề bài yêu cầu:
1. **Call API get all breeds** để hiển thị thông tin từng giống chó (khi có Internet):
   - API: `https://dogapi.dog/api/v2/breeds`
   - Hiển thị: `name`, `description`, `life (min-max)`, `male_weight`, `female_weight`, `hypoallergenic`.
2. **Ngắt Internet, sau đó gọi lại API get all breeds**:
   - Ứng dụng bắt lỗi mạng, không bị crash hoặc trắng trang.
   - **Giữ nguyên dữ liệu cũ đã lưu từ cache** (`redux-persist` lưu trong `localStorage`).
   - Có nút **"Thử lại / Gọi lại API"**.

## Kiến trúc & Công nghệ:
- **React 18** + **Vite** + **TypeScript**.
- **Redux Toolkit** (`createAsyncThunk`, `createSlice`).
- **Redux Persist** (`localStorage`, whitelist slice `breeds`, blacklist `['status', 'error']`).
- **Tầng Mạng riêng biệt (`src/api/`)**: `httpClient` tích hợp timeout 10s qua `AbortController` và bắt lỗi `NETWORK_ERROR`.
- **Duyệt phân trang tự động**: Vòng lặp `while (links.next)` gom toàn bộ 283 giống chó về bộ nhớ đệm.

## Cài đặt & Chạy:
```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Build kiểm tra TypeScript
npm run build
```
