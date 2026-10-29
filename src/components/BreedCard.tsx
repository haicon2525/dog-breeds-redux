import React, { useState, useEffect } from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
  isOnline: boolean;
  isApiFailed: boolean;
}

export function BreedCard({ breed, isOnline, isApiFailed }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;
  const imageUrl = attr.images?.[0]?.medium || attr.images?.[0]?.url || null;

  // Trạng thái load ảnh: nếu thẻ img bị lỗi tải thì set = true để ẩn sạch khung ảnh
  const [imgLoadFailed, setImgLoadFailed] = useState<boolean>(false);

  // Khi có mạng trở lại, cho phép thử load lại ảnh
  useEffect(() => {
    if (isOnline && !isApiFailed) {
      setImgLoadFailed(false);
    }
  }, [isOnline, isApiFailed]);

  // Điều kiện để hiển thị ảnh: Phải có mạng, API không lỗi, có link ảnh và ảnh không bị lỗi tải
  const shouldShowImage = isOnline && !isApiFailed && imageUrl && !imgLoadFailed;

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className={`breed-card ${!shouldShowImage ? 'offline-mode' : ''}`}>
      {/* 1. CHỈ HIỆN ẢNH KHI THỰC SỰ CÓ MẠNG & ẢNH TẢI ĐƯỢC. NẾU MẤT MẠNG -> ẨN SẠCH 100%, KHÔNG ĐỂ LẠI KHUNG TRẮNG */}
      {shouldShowImage && (
        <div className="breed-image-wrap">
          <img
            src={imageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
            onError={() => setImgLoadFailed(true)} // Nếu ảnh lỗi -> ẩn khung ảnh lập tức
          />
        </div>
      )}

      {/* 2. Thân Card: Khi không có ảnh thì co lại gọn gàng, đẹp mắt */}
      <div className="breed-card-body">
        <div className="breed-card-header">
          <h2>
            {!shouldShowImage && <span className="dog-icon">🐾 </span>}
            {attr.name}
          </h2>
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
