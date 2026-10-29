import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps): React.JSX.Element | null {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-text">
        Hiển thị {startItem}–{endItem} trên {totalItems} giống chó
      </span>
      <div className="pagination-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Trước
        </button>
        <span className="pagination-current">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau ›
        </button>
      </div>
    </nav>
  );
}

