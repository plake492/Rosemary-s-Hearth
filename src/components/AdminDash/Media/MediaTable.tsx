import * as React from 'react';
import DataSearchBar from '../DataSearchBar';
import ModalWrapper from '../../ModalWrapper';
import useHandleMedia from '@/hooks/useHandleMedia';
import MediaForm from './MediaForm';
import MediaItem from './MediaItem';
import Button from '@/components/Button';
import type { ProductWithMedia } from '@/types';

interface MediaTableProps {
  showAddButton?: boolean;
  hideDeleteButton?: boolean;
  setMediaIds?: React.Dispatch<React.SetStateAction<string[]>>;
  mediaIds?: string[];
  isUpdatingProductMedia?: boolean;
  item?: ProductWithMedia;
}

export default function MediaTable({
  hideDeleteButton = false,
  showAddButton = false,
  setMediaIds,
  mediaIds,
  isUpdatingProductMedia,
  item,
}: MediaTableProps) {
  const { refreshMedia, mediaItemsFull } = useHandleMedia();
  const [showAddMediaModal, setShowAddMediaModal] = React.useState(false);
  const [itemsCopy, setItemsCopy] = React.useState(mediaItemsFull);
  const [items, setItems] = React.useState(mediaItemsFull);

  React.useEffect(() => {
    const getMedia = async () => {
      const data = await refreshMedia();
      setItems(data || []);
      setItemsCopy(data || []);
    };
    if (mediaItemsFull.length === 0) {
      getMedia();
    }
  }, []);

  React.useEffect(() => {
    if ((mediaItemsFull || (item?.media && item.media.length > 0)) && isUpdatingProductMedia) {
      const sortedItems = [...items].sort((a, b) => {
        const aIsSelected = mediaIds?.includes(a.uuid) || false;
        const bIsSelected = mediaIds?.includes(b.uuid) || false;

        if (aIsSelected && !bIsSelected) return -1;
        if (!aIsSelected && bIsSelected) return 1;
        return 0;
      });

      setItems(sortedItems);
      setItemsCopy(sortedItems);
    }
  }, [isUpdatingProductMedia, mediaItemsFull]);

  // Filter function
  const filterMediaItems = (input: string) => {
    const normalizedInput = input.replace(/\s+/g, '').toLowerCase();
    const filtered = itemsCopy.filter((item) => {
      // Combine item name and all nested product names into a single string
      const names = [
        item.name || '',
        ...((item as any).product_media
          ? Array.isArray((item as any).product_media)
            ? (item as any).product_media.map((pm: any) => pm.product?.name || '')
            : [(item as any).product_media.product?.name || '']
          : []),
      ];
      const combinedNames = names.join(' ').replace(/\s+/g, '').toLowerCase();
      return combinedNames.includes(normalizedInput);
    });
    setItems(filtered);
  };

  const handleCheckboxChange = (uuid: string) => {
    if (setMediaIds) {
      setMediaIds((prev) => {
        const newSet: Set<string> = new Set(prev);
        if (newSet.has(uuid)) {
          newSet.delete(uuid);
        } else {
          newSet.add(uuid);
        }
        return Array.from(newSet);
      });
    }
  };

  return (
    <>
      <>
        <div className="sticky top-0 bg-white z-10 pt-2 pb-2 border-b-2">
          <DataSearchBar onFilterChange={(e) => filterMediaItems(e.target.value)}>
            <Button
              onClick={() => setShowAddMediaModal(true)}
              aria-label="Add Media Item"
              className="cursor-pointer"
              variant="primary"
              size="md"
            >
              Add Media
            </Button>
          </DataSearchBar>

          <div className="mb-0 pb-2 pt-3 grid grid-cols-4 gap-4 items-center px-4 font-semibold">
            <div className="h5 uppercase">Image</div>
            <div className="h5 uppercase">Name</div>
            <div className="h5 uppercase">Product</div>
            <div className="h5 uppercase ml-8">Edit</div>
          </div>
        </div>
        <ul className="list-disc pt-4">
          {items.length > 0 ? (
            items.map((item, i, arr) => (
              <MediaItem
                key={item.uuid}
                item={item}
                mediaIds={mediaIds}
                handleCheckboxChange={handleCheckboxChange}
                hideDeleteButton={hideDeleteButton}
                showAddButton={showAddButton}
                notLast={i < arr.length - 1}
              />
            ))
          ) : (
            <p>No media mediaItems found.</p>
          )}
        </ul>
      </>
      <ModalWrapper
        className="max-w-lg px-8 py-16 pr-16 bg-white"
        style={{ maxWidth: '600px' }}
        showModal={showAddMediaModal}
        setShowModal={setShowAddMediaModal}
      >
        <MediaForm setShowModal={setShowAddMediaModal} label={'Add Media'} />
      </ModalWrapper>
    </>
  );
}
