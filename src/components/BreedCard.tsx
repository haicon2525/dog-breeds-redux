import React, { useState, useEffect } from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
}

export function BreedCard({ breed }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;

  // 1. CHỈ dùng link ảnh tĩnh trực tiếp từ CDN (.webp / .jpg), KHÔNG dùng link API redirect 302
  const directImageUrl = attr.images?.[0]?.medium || attr.images?.[0]?.url || null;

  // 2. Nếu không có link ảnh HOẶC đang mất mạng thì xác định trạng thái lỗi ngay
  const [imgError, setImgError] = useState<boolean>(() => {
    if (!directImageUrl) return true;
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  // 3. Xử lý timeout an toàn: nếu ảnh bị treo quá 3 giây (khi mạng chập chờn), hiện Placeholder ngay lập tức
  useEffect(() => {
    if (!directImageUrl || imgError) return;

    // Timeout 3 giây tự động ngắt nếu trình duyệt cố retry mạng
    const timer = setTimeout(() => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setImgError(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [directImageUrl, imgError]);

  // 4. Lắng nghe sự kiện online/offline của trình duyệt
  useEffect(() => {
    const handleOnline = () => {
      if (directImageUrl) {
        setImgError(false); // Bật mạng lại -> tự động tải lại ảnh thật ngay
      }
    };

    const handleOffline = () => {
      // Khi mất mạng, nếu thẻ img chưa có sẵn trong cache -> kích hoạt fallback ngay trong 0s
      if (!directImageUrl) {
        setImgError(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [directImageUrl]);

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className="breed-card">
      {/* Khung hiển thị ảnh với phản hồi Offline tức thì */}
      <div className="breed-image-wrap">
        {directImageUrl && !imgError ? (
          <img
            src={directImageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="breed-image-placeholder">
            <span className="placeholder-icon">🐕</span>
            <span className="placeholder-name">{attr.name}</span>
            <small className="placeholder-note">
              {!directImageUrl
                ? 'Chưa có ảnh từ máy chủ'
                : 'Ảnh chưa kịp lưu cache khi Offline'}
            </small>
          </div>
        )}
      </div>

      <div className="breed-card-body">
        <div className="breed-card-header">
          <h2>{attr.name}</h2>
          <span className={`badge ${attr.hypoallergenic ? 'badge-yes' : 'badge-no'}`}>
            Hypoallergenic: {attr.hypoallergenic ? 'Yes' : 'No'}
          </span>
        </div>

        <p className="breed-description">{attr.description || 'Không có mô tả.'}</p>

        <ul className="breed-stats">
          <li>
            <span>⏳ Life Span:</span>
            <strong>{lifeMin} – {lifeMax} years</strong>
          </li>
          <li>
            <span>♂️ Male Weight:</span>
            <strong>{maleMin} – {maleMax} kg</strong>
          </li>
          <li>
            <span>♀️ Female Weight:</span>
            <strong>{femaleMin} – {femaleMax} kg</strong>
          </li>
        </ul>
      </div>
    </article>
  );
}
