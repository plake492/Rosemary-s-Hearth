import * as React from 'react';
import { OutlineModeEdit, BaselineDelete } from '../Svg';
import DataSearchBar from './DataSearchBar';
import IconButton from '../IconButton';
import ModalWrapper from '../ModalWrapper';
import type { Tables } from '../../../database.types';
import useMediaPicker from '@/hooks/useMediaPicker';
import MediaForm from './MediaForm';
import DeleteConfirmation from './DeleteConfirmation';
import { deleteMediaItem } from '../../routes/_dashboard/_actions/mediaActions';

export default function MediaTable({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) {
  const { refreshMedia, mediaItems, mediaItemsFull, setMediaItems } =
    useMediaPicker();

  const [closeOverride, setCloseOverride] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = React.useState<
    Tables<'media'> | undefined
  >(undefined);

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

  return (
    <>
      <div className="p-4 bg-white rounded-md">
        <div className="sticky top-0 bg-white z-10 pt-2 pb-2">
          <DataSearchBar
            onFilterChange={(e) => filterMediaItems(e.target.value)}
            DataTable={<MediaForm closeModal={setCloseOverride} />}
            closeOverride={closeOverride}
          />

          <div className="mb-0 pb-2 pt-3 grid grid-cols-4 gap-4 items-center px-4  border-b-2 font-semibold">
            <div className="h5 uppercase">Image</div>
            <div className="h5 uppercase">Name</div>
            <div className="h5 uppercase">Product</div>
            <div className="h5 uppercase ml-8">Edit</div>
          </div>
        </div>
        <ul className="list-disc pt-4">
          {mediaItems.length > 0 ? (
            mediaItems.map((item, i, arr) => (
              <li
                key={item.id}
                className="list-none [&:not(:last-child)]:mb-2 pt-2 hover:bg-gray-100 transition-colors"
              >
                <div className="mb-2 grid grid-cols-4 gap-4 items-center pl-2">
                  <img
                    src={item.url}
                    alt={item.alt || 'Media Item'}
                    className="w-32 h-32 object-cover"
                  />
                  <h3>{item.name}</h3>
                  <div>
                    {item.product_media?.product?.name}
                    {/* {item.product_media?.product &&
                  Object.keys(item.product_media.product).map((key) => (
                    <div key={key} className="mb-2">
                      <strong>{'Products'}</strong>{' '}
                      {item.product_media.product[key]}
                    </div>
                  ))} */}
                  </div>
                  <div className="flex gap-2 ml-8 items-center">
                    <IconButton
                      className="w-12 h-12 p-2.5 hover:bg-emerald-200 rounded-full cursor-pointer transition color-brown-700"
                      onClick={() => {
                        setItemToEdit(item);
                      }}
                      aria-label="Edit media item"
                    >
                      <OutlineModeEdit />
                    </IconButton>
                    <IconButton
                      className="w-12 h-12 p-2.5 hover:bg-orange-700 hover:color-white-200 rounded-full cursor-pointer transition color-brown-700"
                      onClick={() => setIdToDelete(item.uuid)}
                    >
                      <BaselineDelete />
                    </IconButton>
                    {showAddButton && (
                      <input
                        type="checkbox"
                        className="appearance-none w-6 h-6 border-2 border-brown-700 rounded-full checked:bg-emerald-200 checked:border-emerald-400 transition flex mediaItems-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 ml-3"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                  </div>
                </div>
                {i < arr.length - 1 && <hr />}
              </li>
            ))
          ) : (
            <p>No media mediaItems found.</p>
          )}
        </ul>
      </div>
      {/* Edit */}
      <ModalWrapper
        openOverride={!!itemToEdit}
        setOpenOverride={() => setItemToEdit(undefined)}
        style={{ maxWidth: '600px' }}
        className="max-w-4xl bg-white px-8 pb-16 pr-16"
      >
        <MediaForm
          item={itemToEdit}
          isUpdating
          closeModal={() => setItemToEdit(undefined)}
        />
      </ModalWrapper>
      {/* Delete */}
      <ModalWrapper
        openOverride={!!idToDelete}
        setOpenOverride={() => setIdToDelete(null)}
        style={{ maxWidth: '600px', maxHeight: 'unset', minHeight: 'unset' }}
        className="max-w-4xl bg-white px-8 pb-4 pr-16"
      >
        <DeleteConfirmation
          onConfirm={() => {
            if (idToDelete) {
              deleteMediaItem(idToDelete);
              setIdToDelete(null);
            }
          }}
          onCancel={() => setIdToDelete(null)}
          label="Delete Media Item"
        />
      </ModalWrapper>
    </>
  );
}
