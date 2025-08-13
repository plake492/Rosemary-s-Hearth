import React from 'react';
import { OutlineModeEdit, BaselineDelete } from '../Svg';
import IconButton from '../IconButton';
import ModalWrapper from '../ModalWrapper';
import type { Tables } from '../../../database.types';
import useMediaPicker from '@/hooks/useMediaPicker';
import MediaForm from './MediaForm';
import DeleteConfirmation from './DeleteConfirmation';

export default function MediaTable({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) {
  const { mediaItems, filterMediaItems, deleteMediaItem } = useMediaPicker();
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = React.useState<
    Tables<'media'> | undefined
  >(undefined);

  return (
    <>
      <div className="p-4 bg-white rounded">
        <div className="sticky top-0 bg-white z-10 pt-4 pb-2">
          <div className="flex justify-start items-center mb-3 mt-4">
            <h4 className="mb-2 px-4">Media Items</h4>
            <input
              type="text"
              placeholder="Search media by name..."
              className="w-full max-w-[400px] px-3 py-2 border rounded"
              onChange={(e) => filterMediaItems(e.target.value)}
            />
          </div>

          <div className="mb-0 pb-2 pt-6 grid grid-cols-4 gap-4 items-center px-4  border-b-2 font-semibold">
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
