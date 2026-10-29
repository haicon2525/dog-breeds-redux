import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchAllBreeds } from './store/breedsThunks';
import { BreedList } from './components/BreedList';
import { ErrorState } from './components/ErrorState';
import { Pagination } from './components/Pagination';
import './index.css';

const PAGE_SIZE = 12;

export default function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.breeds);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Initial fetch on mount (Connected Internet)
  useEffect(() => {
    dispatch(fetchAllBreeds());
  }, [dispatch]);

  const handleCallApi = () => {
    dispatch(fetchAllBreeds());
  };

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
        <p>Redux Toolkit + Redux Persist (Offline Handling)</p>
      </header>

      {/* Control Action Bar */}
      <div className="control-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCallApi}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Đang gọi API...' : '🔄 Gọi lại API get all breeds'}
        </button>
        <span className={`status-badge status-${status}`}>
          Status: {status}
        </span>
      </div>

      {/* Error state (when disconnected or API fails) */}
      {status === 'failed' && (
        <ErrorState
          error={error}
          cachedCount={totalCount}
          onRetry={handleCallApi}
          isLoading={isLoading}
        />
      )}

      {/* Loading feedback */}
      {isLoading && (
        <div className="loading-bar">
          ⏳ Đang đồng bộ danh sách toàn bộ giống chó từ API...
        </div>
      )}

      {/* Breeds List */}
      <main className="main-content">
        <BreedList breeds={paginatedBreeds} />
      </main>

      {/* Pagination */}
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
