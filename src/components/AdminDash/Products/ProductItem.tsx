import React from 'react';
import ModalWrapper from '../../ModalWrapper';
import ProductForm from './ProductForm';
import { SpinningLoader } from '../../Svg';
import { wait } from '@/utils/helpers';
import useHandleProducts from '@/hooks/useHandleProducts';
import type { Tables } from '../../../../database.types';

interface ProductProps {
  fetchProductData: () => Promise<void>;
  product: Tables<'product'> & {
    media?: Tables<'media'>[];
  };
}

export default function ProductItem({
  product,
  fetchProductData,
}: ProductProps) {
  const { handleTogglePublished } = useHandleProducts({
    skipUnpublished: false,
  });

  const [showEditProductModal, setShowEditProductModal] = React.useState(false);
  const [loadingPublishedState, setloadingPublishedState] =
    React.useState<boolean>(false);

  const togglePublished = async () => {
    setloadingPublishedState(true);
    await handleTogglePublished(product.uuid);
    await wait(1000);
    setloadingPublishedState(false);
  };

  return (
    <>
      <li
        key={product.id}
        className="flex flex-col align-items-start gap-2 p-2 relative"
      >
        {loadingPublishedState && (
          <div className="p-24 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#39373750]">
            <SpinningLoader />
          </div>
        )}
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

        <span className="h5 align-sub">
          <strong className="h3">{product.name}</strong> — ${product.price}
        </span>

        <span className="text-sm text-gray-700">{product.description}</span>

        <div className="flex gap-2 justify-between">
          <button
            className="mt-4 bg-brown text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer"
            onClick={() => setShowEditProductModal(true)}
          >
            Edit Product
          </button>

          <div className="flex flex-row-reverse items-center gap-2 mt-4">
            <label
              htmlFor={`published-toggle-${product.id}`}
              className="relative inline-flex items-center cursor-pointer select-none"
              style={{
                minWidth: 120,
                opacity: loadingPublishedState ? 0.5 : 1,
              }}
            >
              <span
                className="mr-3 text-base text-gray-800"
                style={{
                  opacity: product.published ? 0.4 : 1,
                }}
              >
                Unpublished
              </span>
              <input
                type="checkbox"
                id={`published-toggle-${product.id}`}
                name={`published-toggle-${product.id}`}
                checked={!!product.published}
                onClick={togglePublished}
                readOnly
                className="sr-only peer"
                disabled={loadingPublishedState}
              />
              <span
                className={`w-11 h-6 flex items-center rounded-full transition-colors relative ${
                  product.published ? 'bg-orange' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 transition-transform w-4 h-4 rounded-full translate ${
                    product.published
                      ? 'bg-orange translate-x-5 border-2 border-white'
                      : 'bg-white'
                  }`}
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                ></span>
              </span>
              <span
                className="ml-3 text-base text-gray-800"
                style={{
                  opacity: product.published ? 1 : 0.4,
                }}
              >
                Published
              </span>
            </label>
          </div>
        </div>
      </li>
      <ModalWrapper
        style={{ maxWidth: '600px' }}
        className="max-w-4xl bg-white px-8 py-16 pr-16"
        showModal={showEditProductModal}
        setShowModal={setShowEditProductModal}
      >
        <ProductForm
          product={product}
          fetchProductData={fetchProductData}
          isUpdating
          setShowModal={setShowEditProductModal}
          label="Edit Product"
        />
      </ModalWrapper>
    </>
  );
}
