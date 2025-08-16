import React from 'react';
// import Stepper from './Stepper';
import ProductForm from './ProductForm';
import MediaTable from '../Media/MediaTable';
import Stepper from '../Stepper';
import useHandleProducts from '@/hooks/useHandleProducts';
import { updateMediaOnProduct } from '@/routes/_dashboard/_actions/productActions';

const config = [
  {
    step: 1,
    label: 'Add Product Info',
  },
  {
    step: 2,
    label: 'Add Media',
  },
];

export default function ProductAddFlow({
  setShowProductModal,
}: {
  setShowProductModal: (value: boolean) => void;
}) {
  const { refreshProducts } = useHandleProducts({
    skipUnpublished: false,
  });

  const [currentStep, setCurrentStep] = React.useState(1);
  const [mediaIds, setMediaIds] = React.useState<string[]>([]);
  const [isUpdatingState, setIsUpdatingState] = React.useState(false);
  const [inViewProductId, setInViewProductId] = React.useState<string | null>(
    null,
  );

  const handleAddMediaToProduct = async () => {
    console.log('Adding media to product', { inViewProductId, mediaIds });

    if (!inViewProductId || mediaIds.length === 0) {
      return;
    }
    console.log('Updating media on product...');

    setIsUpdatingState(true);
    await updateMediaOnProduct({
      productId: inViewProductId,
      mediaIds,
    });
    console.log('DID I CGOET HJERE');

    setMediaIds([]);
    setIsUpdatingState(false);

    await refreshProducts();
    setShowProductModal(false);
    setInViewProductId(null);
    setCurrentStep(1);
  };

  return (
    <>
      {currentStep === 1 && (
        <div className="max-w-4xl bg-white pl-8 py-16 pr-16">
          <h2 className="h3 mb-12 pr-16">Add Product Info</h2>
          <Stepper
            config={config}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          <ProductForm
            fetchProductData={refreshProducts}
            setCurrentStep={setCurrentStep}
            setInViewProductId={setInViewProductId}
            onInsertProduct={(product) => {
              setInViewProductId(product.uuid);
              setCurrentStep(2);
            }}
          />
        </div>
      )}{' '}
      {currentStep === 2 && (
        <>
          <div className="px-8 pt-16">
            <h2 className="h3 mb-12 pr-16">Add Media</h2>
            <Stepper
              config={config}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
            <MediaTable
              showAddButton
              hideDeleteButton
              setMediaIds={setMediaIds}
              mediaIds={mediaIds}
            />
          </div>

          <div className="sticky bottom-0 right-0 p-4 bg-cream width-full flex justify-end gap-4">
            <button
              type="button"
              className="text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer bg-white"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </button>
            <button
              disabled={mediaIds.length === 0 || isUpdatingState}
              type="button"
              className="text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer bg-brown"
              onClick={handleAddMediaToProduct}
            >
              Add Media To Product
            </button>
          </div>
        </>
      )}
    </>
  );
}
