import type { Tables } from '../../database.types';

export type PriceQtyRow = Tables<'price-quantity'>;

export type ProductType = Tables<'product'>;

export type MediaType = Tables<'media'>;

export type PartialProduct = Partial<ProductType>;

export type ProductStatus = 'draft' | 'complete' | 'archived';

export interface ProductWithJoins extends ProductType {
  media?: MediaType[];
  priceQty?: PriceQtyRow[];
}

export type ButtonVariant = 'primary' | 'secondary' | 'border' | 'error' | 'error-border';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}
