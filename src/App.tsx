import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchAllBreeds } from './store/breedsThunks';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { BreedList } from './components/BreedList';
import { ErrorState } from './components/ErrorState';
import { Pagination } from './components/Pagination';
import './index.css';

const PAGE_SIZE = 12;

export default function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.breeds);
  const isOnline = useOnlineStatus();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Initial fetch with cleanup abort on mount
  useEffect(() => {
    const promise = dispatch(fetchAllBreeds());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  // 2. Tự động đồng bộ lại khi có mạng trở lại
  useEffect(() => {
    if (isOnline) {
      dispatch(fetchAllBreeds());
    }
  }, [isOnline, dispatch]);

  const handleRetry = () => {
    dispatch(fetchAllBreeds());
  };

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedBreeds = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  const isLoading = status === 'loading';
  const isApiFailed = status === 'failed';

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header">
        <h1>🐾 Dog Breeds Explorer</h1>
        <p>Redux Toolkit + Redux Persist (Offline-First Adaptive UI)</p>
      </header>

      {/* Thông báo trạng thái: lỗi khi ngắt mạng hoặc loading */}
      {isApiFailed && (
        <ErrorState
          error={error}
          cachedCount={totalCount}
          onRetry={handleRetry}
          isLoading={isLoading}
        />
      )}

      {/* Loading bar */}
      {isLoading && (
        <div className="loading-bar">
          ⏳ Đang đồng bộ danh sách toàn bộ giống chó từ API...
        </div>
      )}

      {/* Danh sách giống chó: Tự động ẩn sạch khung ảnh khi mất mạng / lỗi API */}
      <main className="main-content">
        <BreedList
          breeds={paginatedBreeds}
          isOnline={isOnline}
          isApiFailed={isApiFailed}
        />
      </main>

      {/* Phân trang: Có chọn nhanh trang bất kỳ ở giữa + nút Đầu/Cuối */}
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
