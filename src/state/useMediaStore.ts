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

const useMediaStore = create<MediaStoreState & MediaStoreActions>((set) => ({
  mediaItems: [],
  mediaItemsFull: [],
  setMediaItems: (items: Tables<'media'>[]) => set({ mediaItems: items }),
  setMediaItemsFull: (items: Tables<'media'>[]) =>
    set({ mediaItemsFull: items }),
}));

export { useMediaStore };
