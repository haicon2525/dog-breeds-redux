import React from 'react';
import { BreedCard } from './BreedCard';
import type { BreedResource } from '../types/breeds.types';

interface BreedListProps {
  breeds: BreedResource[];
}

export function BreedList({ breeds }: BreedListProps): React.JSX.Element {
  if (breeds.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có dữ liệu giống chó nào.</p>
      </div>
    );
  }

  return (
    <div className="breed-grid">
      {breeds.map((breed) => (
        <BreedCard key={breed.id} breed={breed} />
      ))}
    </div>
  );
}

