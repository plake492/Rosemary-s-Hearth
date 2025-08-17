import type { Tables } from '../../database.types';

export type ProductType = Tables<'product'>;

export type MediaType = Tables<'media'>;

export type PartialProduct = Partial<ProductType>;

export type ProductStatus = 'draft' | 'complete' | 'archived';

export interface ProductWithMedia extends ProductType {
  media?: MediaType[];
}
