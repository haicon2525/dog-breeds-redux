import React from 'react';

interface ErrorStateProps {
  error: string | null;
  cachedCount: number;
  onRetry: () => void;
  isLoading: boolean;
}

export function ErrorState({
  error,
  cachedCount,
  onRetry,
  isLoading,
}: ErrorStateProps): React.JSX.Element {
  return (
    <div className="error-box" role="alert">
      <div className="error-content">
        <strong>⚠️ Không thể gọi API:</strong>
        <p>{error || 'Lỗi kết nối tới máy chủ.'}</p>
        {cachedCount > 0 && (
          <p className="cache-note">
            Vẫn hiển thị an toàn <strong>{cachedCount}</strong> giống chó từ bộ nhớ đệm (<code>localStorage</code>).
          </p>
        )}
      </div>
      <button
        type="button"
        className="btn btn-retry"
        onClick={onRetry}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Đang thử lại...' : 'Thử lại / Gọi lại API'}
      </button>
    </div>
  );
}

