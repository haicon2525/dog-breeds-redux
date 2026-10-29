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

  // Tính toán dải số trang xung quanh trang hiện tại (tối đa 5 nút)
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Thông tin số lượng & Dropdown nhảy trang nhanh */}
      <div className="pagination-info">
        <span className="pagination-text">
          Hiển thị <strong>{startItem}–{endItem}</strong> trên <strong>{totalItems}</strong> giống chó
        </span>

        {/* Dropdown chọn nhanh trang ở giữa */}
        <div className="page-select-wrap">
          <label htmlFor="page-select">Nhảy tới trang:</label>
          <select
            id="page-select"
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="page-dropdown"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <option key={pageNum} value={pageNum}>
                Trang {pageNum} / {totalPages}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cụm nút điều hướng: Đầu - Trước - [1, 2, 3, 4, 5] - Sau - Cuối */}
      <div className="pagination-actions">
        {/* Nút về trang Đầu */}
        <button
          type="button"
          className="btn btn-secondary btn-nav"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Về trang đầu tiên"
        >
          « Đầu
        </button>

        {/* Nút Trước */}
        <button
          type="button"
          className="btn btn-secondary btn-nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Trước
        </button>

        {/* Nút số trang cụ thể */}
        {pageNumbers[0] > 1 && <span className="page-ellipsis">...</span>}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`btn-page-number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <span className="page-ellipsis">...</span>
        )}

        {/* Nút Sau */}
        <button
          type="button"
          className="btn btn-secondary btn-nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau ›
        </button>

        {/* Nút tới trang Cuối */}
        <button
          type="button"
          className="btn btn-secondary btn-nav"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Tới trang cuối cùng"
        >
          Cuối »
        </button>
      </div>
    </nav>
  );
}
