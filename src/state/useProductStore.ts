import { create } from 'zustand';
import type { Tables } from '../../database.types';

interface ProductStoreState {
  productItems: Tables<'product'>[];
  productItemsFull: Tables<'product'>[];
}
interface ProductStoreActions {
  setProductItems: (items: Tables<'product'>[]) => void;
  setProductItemsFull: (items: Tables<'product'>[]) => void;
}

const useProductStore = create<ProductStoreState & ProductStoreActions>(
  (set) => ({
    productItems: [],
    productItemsFull: [],
    setProductItems: (items: Tables<'product'>[]) =>
      set({ productItems: items }),
    setProductItemsFull: (items: Tables<'product'>[]) =>
      set({ productItemsFull: items }),
  }),
);

export { useProductStore };
