export interface MinMaxRange {
  min: number;
  max: number;
}

export interface BreedAttributes {
  name: string;
  description: string;
  life: MinMaxRange;
  male_weight: MinMaxRange;
  female_weight: MinMaxRange;
  hypoallergenic: boolean;
}

export interface BreedResource {
  id: string;
  type: string;
  attributes: BreedAttributes;
}

export interface BreedsApiResponse {
  data: BreedResource[];
  links?: {
    next?: string | null;
  };
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BreedsState {
  items: BreedResource[];
  status: RequestStatus;
  error: string | null;
}

