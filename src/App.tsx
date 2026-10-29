import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchAllBreeds } from './store/breedsThunks';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { BreedList } from './components/BreedList';
import { Pagination } from './components/Pagination';
import './index.css';

const PAGE_SIZE = 12;

export default function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.breeds);
  const isOnline = useOnlineStatus();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Biến cờ chặn StrictMode chạy đúp ở lần mount đầu tiên
  // Giúp không bị duplicate và không còn request đỏ (canceled)
  const hasInitialized = useRef<boolean>(false);

  // 2. Biến cờ theo dõi: CHỈ khi nào từng bị mất mạng rồi mới có mạng lại thì mới tự gọi lại API
  const wasOffline = useRef<boolean>(false);

  // Gọi API lần đầu tiên khi mở web (chạy đúng 1 lần duy nhất)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    dispatch(fetchAllBreeds());
  }, [dispatch]);

  // Lắng nghe khi mạng chuyển từ Offline -> Online
  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true; // Ghi nhận vừa bị rớt mạng
    } else if (wasOffline.current) {
      wasOffline.current = false; // Có mạng lại -> mới tự động gọi lại API để đồng bộ
      dispatch(fetchAllBreeds());
    }
  }, [isOnline, dispatch]);

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedBreeds = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  const isLoading = status === 'loading';

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header">
        <h1>🐾 Dog Breeds Explorer</h1>
        <p>Redux Toolkit + Redux Persist (Offline-First Adaptive UI)</p>
      </header>

      {/* Loading bar */}
      {isLoading && (
        <div className="loading-bar">
          ⏳ Đang đồng bộ danh sách toàn bộ giống chó từ API...
        </div>
      )}

      {/* Danh sách giống chó */}
      <main className="main-content">
        <BreedList breeds={paginatedBreeds} isOnline={isOnline} />
      </main>

      {/* Phân trang */}
      <footer className="footer-pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </footer>
    </div>
  );
}
