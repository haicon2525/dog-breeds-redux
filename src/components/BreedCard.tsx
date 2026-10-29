import React, { useState, useEffect } from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
  isOnline: boolean;
}

export function BreedCard({ breed, isOnline }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;
  const imageUrl = attr.images?.[0]?.medium || attr.images?.[0]?.url || null;

  // Trạng thái load ảnh thực tế của thẻ <img>
  const [imgLoadFailed, setImgLoadFailed] = useState<boolean>(false);

  // Khi có mạng trở lại, cho phép thẻ <img> thử tải lại
  useEffect(() => {
    if (isOnline) {
      setImgLoadFailed(false);
    }
  }, [isOnline]);

  // Điều kiện hiển thị ảnh: Hoàn toàn độc lập với Redux status,
  // chỉ dựa vào trạng thái mạng thực tế và kết quả load ảnh của trình duyệt.
  // Khi F5 lúc có mạng: isOnline = true, imgLoadFailed = false -> Render ảnh NGAY LẬP TỨC trong 0ms, không bao giờ bị chớp màn offline!
  const shouldShowImage = isOnline && imageUrl && !imgLoadFailed;

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className={`breed-card ${!shouldShowImage ? 'offline-mode' : ''}`}>
      {/* 1. Khung ảnh: Render mượt mà ngay từ giây đầu tiên khi Online */}
      {shouldShowImage && (
        <div className="breed-image-wrap">
          <img
            src={imageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
            onError={() => setImgLoadFailed(true)}
          />
        </div>
      )}

      {/* 2. Thân Card */}
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
