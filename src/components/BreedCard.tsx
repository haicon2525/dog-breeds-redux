import React from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
  isOnline: boolean;
}

export function BreedCard({ breed, isOnline }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;

  // Lấy link ảnh từ CDN
  const imageUrl = attr.images?.[0]?.medium || attr.images?.[0]?.url || null;

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className={`breed-card ${!isOnline ? 'offline-mode' : ''}`}>
      {/* 1. KHI CÓ MẠNG (isOnline = true): Hiển thị khung ảnh media sinh động */}
      {isOnline && imageUrl && (
        <div className="breed-image-wrap">
          <img
            src={imageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
          />
        </div>
      )}

      {/* 2. Thân Card (Cả 2 chế độ đều hiển thị thông tin rõ ràng, khi offline thì co gọn tinh tế) */}
      <div className="breed-card-body">
        <div className="breed-card-header">
          <h2>
            {!isOnline && <span className="dog-icon">🐾 </span>}
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
