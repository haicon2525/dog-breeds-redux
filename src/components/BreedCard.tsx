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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Khi có mạng trở lại, cho phép thử tải lại ảnh
  useEffect(() => {
    if (isOnline) {
      setHasError(false);
    }
  }, [isOnline]);

  // Chỉ cho phép hiển thị ảnh khi đang online, có đường dẫn và ảnh chưa báo lỗi
  const canShowImage = isOnline && Boolean(imageUrl) && !hasError;
  const isImageDisplayed = canShowImage && isLoaded;

  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className={`breed-card ${!isImageDisplayed ? 'offline-mode' : ''}`}>
      {/* Khung ảnh: CHỈ hiển thị khi ảnh đã thực sự tải thành công (isLoaded = true)
          Khi rớt mạng hoặc ảnh lỗi -> display: none hoàn toàn, tuyệt đối không chừa khung trắng */}
      {canShowImage && imageUrl && (
        <div
          className={`breed-image-wrap ${isLoaded ? 'loaded' : ''}`}
          style={isLoaded ? undefined : { display: 'none' }}
        >
          <img
            src={imageUrl}
            alt={attr.name}
            className="breed-image"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(false);
            }}
          />
        </div>
      )}

      {/* Thân Card */}
      <div className="breed-card-body">
        <div className="breed-card-header">
          <h2>
            {!isImageDisplayed && <span className="dog-icon">🐾 </span>}
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
