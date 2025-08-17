import React from 'react';
import ModalWrapper from '../../ModalWrapper';
import ProductAddFlow from './ProductFlow';
import { SpinningLoader } from '../../Svg';
import { wait } from '@/utils/helpers';
import useHandleProducts from '@/hooks/useHandleProducts';
import ProductPublishCheckbox from './ProductPublishCheckbox';
import IconButton from '@/components/IconButton';
import DeleteConfirmation from '@/components/AdminDash/DeleteConfirmation';
import { BaselineDelete, OutlineModeEdit } from '@/components/Svg';
import { handleDeleteProduct } from '../../../routes/_dashboard/_actions/productActions';
import type { ProductWithMedia } from '@/types';

interface ProductProps {
  product: ProductWithMedia;
}

export default function ProductItem({ product }: ProductProps) {
  const { handleTogglePublished, refreshProducts } = useHandleProducts({
    skipUnpublished: false,
  });

  const [showEditProductModal, setShowEditProductModal] = React.useState(false);
  const [loadingPublishedState, setloadingPublishedState] = React.useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const handleDelete = async () => {
    await handleDeleteProduct(product.uuid);
    setShowDeleteConfirmation(false);
    refreshProducts();
  };

  const togglePublished = async (uuid: string) => {
    setloadingPublishedState(true);
    await handleTogglePublished(uuid);
    await wait(1000);
    setloadingPublishedState(false);
  };

  const isDraft = product.status === 'draft';

  return (
    <>
      <div className="flex flex-col align-items-start gap-2 p-2 relative" id={`product-${product.uuid}`}>
        {loadingPublishedState && (
          <div className="p-24 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#39373750]">
            <SpinningLoader />
          </div>
        )}
        {/* Product Info */}
        <>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex gap-2 overflow-x-auto">
              {product.media &&
                product.media.length > 0 &&
                product.media.map((media: any) => (
                  <img
                    key={media.id}
                    src={media.url}
                    alt={product?.name || 'Product Image'}
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
            </div>
            {isDraft ? (
              <p className="h4 uppercase">
                <strong>{product.status}</strong>
              </p>
            ) : null}
          </div>
          <span className="h5 align-sub">
            <strong className="h3">{product.name}</strong> — ${product.price}
          </span>
          <span className="text-sm text-gray-700">{product.description}</span>
        </>

        <div className="flex gap-2 justify-between">
          {!isDraft && (
            <ProductPublishCheckbox
              product={product}
              loadingPublishedState={loadingPublishedState}
              togglePublished={togglePublished}
            />
          )}
          <div className="flex gap-2 ml-auto">
            <IconButton
              className="w-12 h-12 p-3 hover:bg-emerald-300 rounded-full cursor-pointer transition color-brown-700"
              onClick={() => setShowEditProductModal(true)}
              aria-label="Edit media item"
            >
              <OutlineModeEdit />
            </IconButton>
            <IconButton
              className="w-12 h-12 p-3 hover:bg-red-400 hover:color-white-200 rounded-full cursor-pointer transition color-brown-700"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <BaselineDelete />
            </IconButton>
          </div>
        </div>
      </div>
      <ModalWrapper
        style={{ maxWidth: '800px' }}
        showModal={showEditProductModal}
        setShowModal={setShowEditProductModal}
        hideCloseButton
        noCloseOnBackdropClick
      >
        <ProductAddFlow item={product} setShowProductModal={setShowEditProductModal} editing />
      </ModalWrapper>

      <ModalWrapper
        showModal={showDeleteConfirmation}
        setShowModal={() => setShowDeleteConfirmation(false)}
        style={{ maxWidth: '600px', maxHeight: 'unset', minHeight: 'unset' }}
        className="max-w-4xl bg-white  py-16 px-8"
      >
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
          label="Delete Media Item"
        />
      </ModalWrapper>
    </>
  );
}
