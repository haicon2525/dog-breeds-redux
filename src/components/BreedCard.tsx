import React, { useState, useEffect } from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
}

export function BreedCard({ breed }: BreedCardProps): React.JSX.Element {
  const [imgError, setImgError] = useState<boolean>(false);

  // Khi có mạng lại, tự động reset để thử tải lại ảnh thật
  useEffect(() => {
    if (!imgError) return;
    const handleOnline = () => setImgError(false);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [imgError]);

  const attr = breed.attributes;
  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  // Lấy link ảnh từ attributes.images[0] hoặc endpoint fallback của Dog API v2
  const imageUrl =
    attr.images?.[0]?.medium ||
    attr.images?.[0]?.url ||
    `https://dogapi.dog/api/v2/breeds/${breed.id}/image?size=medium`;

  return (
    <article className="breed-card">
      {/* Khung hiển thị ảnh kèm Offline Fallback */}
      <div className="breed-image-wrap">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={attr.name}
            loading="lazy"
            className="breed-image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="breed-image-placeholder">
            <span className="placeholder-icon">🐕</span>
            <span className="placeholder-name">{attr.name}</span>
            <small className="placeholder-note">Ảnh chưa lưu cache khi Offline</small>
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
