import React from 'react';
import type { BreedResource } from '../types/breeds.types';

interface BreedCardProps {
  breed: BreedResource;
}

export function BreedCard({ breed }: BreedCardProps): React.JSX.Element {
  const attr = breed.attributes;
  const lifeMin = attr.life?.min ?? '?';
  const lifeMax = attr.life?.max ?? '?';
  const maleMin = attr.male_weight?.min ?? '?';
  const maleMax = attr.male_weight?.max ?? '?';
  const femaleMin = attr.female_weight?.min ?? '?';
  const femaleMax = attr.female_weight?.max ?? '?';

  return (
    <article className="breed-card">
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
    </article>
  );
}

