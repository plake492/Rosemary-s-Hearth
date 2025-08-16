import * as React from 'react';
import DataSearchBar from '../DataSearchBar';
import ModalWrapper from '../../ModalWrapper';
import useHandleMedia from '@/hooks/useHandleMedia';
import MediaForm from './MediaForm';
import MediaItem from './MediaItem';

interface MediaTableProps {
  showAddButton?: boolean;
  hideDeleteButton?: boolean;
  setMediaIds?: React.Dispatch<React.SetStateAction<string[]>>;
  mediaIds?: string[];
}

export default function MediaTable({
  hideDeleteButton = false,
  showAddButton = false,
  setMediaIds,
  mediaIds,
}: MediaTableProps) {
  const { refreshMedia, mediaItems, mediaItemsFull, setMediaItems } =
    useHandleMedia();

  const [showAddMediaModal, setShowAddMediaModal] = React.useState(false);

  React.useEffect(() => {
    refreshMedia();
  }, []);

  // Filter function
  const filterMediaItems = (input: string) => {
    const normalizedInput = input.replace(/\s+/g, '').toLowerCase();
    const filtered = mediaItemsFull.filter((item) => {
      // Combine item name and all nested product names into a single string
      const names = [
        item.name || '',
        ...(item.product_media
          ? Array.isArray(item.product_media)
            ? item.product_media.map((pm: any) => pm.product?.name || '')
            : [item.product_media.product?.name || '']
          : []),
      ];
      const combinedNames = names.join(' ').replace(/\s+/g, '').toLowerCase();
      return combinedNames.includes(normalizedInput);
    });
    setMediaItems(filtered);
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
          <DataSearchBar
            onFilterChange={(e) => filterMediaItems(e.target.value)}
          >
            <button
              className="bg-orange text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer"
              onClick={() => setShowAddMediaModal(true)}
              aria-label="Add Media Item"
            >
              Add Media
            </button>
          </DataSearchBar>

          <div className="mb-0 pb-2 pt-3 grid grid-cols-4 gap-4 items-center px-4 font-semibold">
            <div className="h5 uppercase">Image</div>
            <div className="h5 uppercase">Name</div>
            <div className="h5 uppercase">Product</div>
            <div className="h5 uppercase ml-8">Edit</div>
          </div>
        </div>
        <ul className="list-disc pt-4">
          {mediaItems.length > 0 ? (
            mediaItems.map((item, i, arr) => (
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
