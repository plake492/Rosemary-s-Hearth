import React from 'react';
import IconButton from '@/components/IconButton';
import ModalWrapper from '@/components/ModalWrapper';
import DeleteConfirmation from '@/components/AdminDash/DeleteConfirmation';
import MediaForm from './MediaForm';
import { OutlineModeEdit, BaselineDelete } from '@/components/Svg';
import { deleteMediaItem } from '../../../routes/_dashboard/_actions/mediaActions';
import type { Tables } from '../../../../database.types';

interface MediaItemProps {
  item: Tables<'media'>;
  hideDeleteButton?: boolean;
  handleCheckboxChange?: (uuid: string) => void;
  showAddButton?: boolean;
  mediaIds?: string[];
  notLast?: boolean;
}

export default function MediaItem({
  item,
  handleCheckboxChange,
  hideDeleteButton,
  showAddButton,
  mediaIds,
  notLast,
}: MediaItemProps) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  return (
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
            onClick={() => setShowEditModal(true)}
            aria-label="Edit media item"
          >
            <OutlineModeEdit />
          </IconButton>

          {!hideDeleteButton && (
            <IconButton
              className="w-12 h-12 p-2.5 hover:bg-orange-700 hover:color-white-200 rounded-full cursor-pointer transition color-brown-700"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <BaselineDelete />
            </IconButton>
          )}
          {showAddButton && handleCheckboxChange && (
            <input
              type="checkbox"
              className="appearance-none w-6 h-6 border-2 border-brown-700 rounded-full checked:bg-emerald-200 checked:border-emerald-400 transition flex mediaItems-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 ml-3"
              checked={mediaIds?.includes(item.uuid) || false}
              onChange={() => handleCheckboxChange(item.uuid)}
              aria-label={`Select media item ${item.name}`}
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

      <ModalWrapper
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        style={{ maxWidth: '600px' }}
        className="max-w-4xl bg-white px-8 py-16 pr-16"
      >
        <MediaForm
          item={item}
          isUpdating
          setShowModal={setShowEditModal}
          label={'Update Product'}
        />
      </ModalWrapper>
      <ModalWrapper
        showModal={showDeleteConfirmation}
        setShowModal={() => setShowDeleteConfirmation(false)}
        style={{ maxWidth: '600px', maxHeight: 'unset', minHeight: 'unset' }}
        className="max-w-4xl bg-white px-8 pb-4 pr-16"
      >
        <DeleteConfirmation
          onConfirm={() => {
            deleteMediaItem(item.uuid);
            setShowDeleteConfirmation(false);
          }}
          onCancel={() => setShowDeleteConfirmation(false)}
          label="Delete Media Item"
        />
      </ModalWrapper>

      {notLast && <hr />}
    </li>
  );
}
