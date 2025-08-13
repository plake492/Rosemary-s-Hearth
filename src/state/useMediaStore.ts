import { create } from 'zustand';
import type { Tables } from '../../database.types';

interface MediaStoreState {
  mediaItems: Tables<'media'>[];
  mediaItemsFull: Tables<'media'>[];
}
interface MediaStoreActions {
  setMediaItems: (items: Tables<'media'>[]) => void;
  setMediaItemsFull: (items: Tables<'media'>[]) => void;
}

interface ProductStoreState {
  productItems: Tables<'product'>[];
  productItemsFull: Tables<'product'>[];
}
interface ProductStoreActions {
  setProductItems: (items: Tables<'product'>[]) => void;
  setProductItemsFull: (items: Tables<'product'>[]) => void;
}

const useMediaStore = create<MediaStoreState & MediaStoreActions>((set) => ({
  mediaItems: [],
  mediaItemsFull: [],
  setMediaItems: (items: Tables<'media'>[]) => set({ mediaItems: items }),
  setMediaItemsFull: (items: Tables<'media'>[]) =>
    set({ mediaItemsFull: items }),
}));

const useProductsStore = create<ProductStoreState & ProductStoreActions>(
  (set) => ({
    productItems: [],
    productItemsFull: [],
    setProductItems: (items: Tables<'product'>[]) =>
      set({ productItems: items }),
    setProductItemsFull: (items: Tables<'product'>[]) =>
      set({ productItemsFull: items }),
  }),
);

export { useMediaStore, useProductsStore };
