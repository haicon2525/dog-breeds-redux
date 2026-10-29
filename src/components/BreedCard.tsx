import React, { useState, useEffect } from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
}

export function BreedCard({ breed }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;

  // 1. Link ảnh tĩnh CDN trực tiếp (.webp / .jpg)
  const directImageUrl = attr.images?.[0]?.medium || attr.images?.[0]?.url || null;

  // 2. KHÔNG chặn trước bằng navigator.onLine! Ban đầu luôn để false để thẻ <img>
  // có cơ hội lấy file ảnh từ Disk Cache (nếu đã từng xem qua trước đó).
  const [imgError, setImgError] = useState<boolean>(!directImageUrl);

  // 3. Khi có mạng trở lại, tự động reset để tải lại ảnh thật
  useEffect(() => {
    if (!directImageUrl) return;

    const handleOnline = () => {
      setImgError(false);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [directImageUrl]);

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className="breed-card">
      <div className="breed-image-wrap">
        {directImageUrl && !imgError ? (
          <img
            src={directImageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
            // Chỉ khi trình duyệt thực sự không tìm thấy ảnh trong Disk Cache
            // và cũng không có mạng để tải, sự kiện onError mới kích hoạt Placeholder
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
