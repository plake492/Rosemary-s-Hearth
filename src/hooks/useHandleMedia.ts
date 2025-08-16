import { useMediaStore } from '@/state/useMediaStore';
import { fetchMediaItems } from '../routes/_dashboard/_actions/mediaActions';

export default function useHandleMedia() {
  const { setMediaItems, setMediaItemsFull, mediaItems, mediaItemsFull } =
    useMediaStore();

  const refreshMedia = async () => {
    const data = await fetchMediaItems();
    setMediaItemsFull(data || []);
    setMediaItems(data || []);
  };

  return {
    mediaItemsFull,
    mediaItems,
    setMediaItems,
    setMediaItemsFull,
    refreshMedia,
  };
}
