import React from 'react';
import useHandleMdeia from '@/hooks/useHandleMedia';
import useHandleProducts from '@/hooks/useHandleProducts';
import { createProduct, updateMediaOnProduct } from '@/routes/_dashboard/_actions/productActions';
import MediaTable from '../Media/MediaTable';
import MediaTableProductButton from '../Media/MediaTableProductButton';
import Stepper from '../Stepper';
import ProductForm from './ProductForm';
import ProductReview from './ProductReview';
// import type { Tables } from '../../../../database.types';
import type { ProductWithMedia, PartialProduct, MediaType, ProductStatus } from '@/types';

const config = [
  { step: 1, label: 'Product Info' },
  { step: 2, label: 'Product Media' },
  { step: 3, label: 'Review Product' },
];

interface ProductFlowProps {
  setShowProductModal: (value: boolean) => void;
  editing?: boolean;
  item?: ProductWithMedia;
}

export default function ProductFlow({ setShowProductModal, item, editing }: ProductFlowProps) {
  const { refreshProducts } = useHandleProducts({ skipUnpublished: false });
  const { refreshMedia } = useHandleMdeia();

  const [productFormError, setProductFormError] = React.useState<string[]>([]);
  const [saveMessage, setSaveMessage] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [mediaIds, setMediaIds] = React.useState<string[]>([]);
  const [stepsCompleted, setStepsCompleted] = React.useState<number[]>([]);
  const [product, setProduct] = React.useState<PartialProduct>(
    item || {
      name: '',
      price: '',
      description: '',
      uuid: '',
      link: '',
    },
  );

  React.useEffect(() => {
    const refresh = async () => await refreshMedia();
    refresh();
  }, []);

  React.useEffect(() => {
    if (editing) {
      setStepsCompleted(config.map((step) => step.step));
      return;
    }
    if (currentStep <= config.length) {
      setStepsCompleted((prev) => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
    }
  }, [currentStep, editing]);

  React.useEffect(() => {
    if (item && item.media) {
      setMediaIds(item.media?.map((media: MediaType) => media.uuid) || []);
    }
  }, [item]);

  const handleCreateProduct = async (step: number, status: ProductStatus = 'draft') => {
    const produtFull = {
      ...product,
      status,
      step,
    };
    const { error, data } = await createProduct(produtFull);
    if (error) {
      setSaveMessage('Error creating product.');
      console.error('Error creating product:', error);
    } else {
      setProduct(data as PartialProduct);
    }
    return { data, error };
  };

  const handelAddMediaToProduct = async () => {
    if (mediaIds && mediaIds.length > 0) {
      const { error } = await updateMediaOnProduct({
        productId: product.uuid!,
        mediaIds,
      });

      if (error) {
        setSaveMessage('Error adding media to product.');
        console.error('Error associating media with product:', error);
        return { error };
      }
    }
  };

  const stepOneNext = async () => {
    const required = {
      name: product.name,
      price: product.price,
    };

    if (!product.name || !product.price) {
      Object.entries(required).forEach(([key, value]) => {
        if (!value) {
          setProductFormError((prev) => [...prev, key]);
        }
      });
      return;
    }
    setProductFormError([]);
    setCurrentStep(2);
  };

  const stepTwoNext = async () => setCurrentStep(3);

  const handleComplete = async (status: ProductStatus) => {
    const { data, error } = await handleCreateProduct(config[config.length - 1].step, status);
    if (error) return;

    const mediaResult = await handelAddMediaToProduct();
    if (mediaResult?.error) return;

    await refreshProducts();

    const targetElement = document.querySelector(`#product-${data?.uuid}`);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }

    scrollTo();
    setShowProductModal(false);
  };

  return (
    <>
      <div className="absolute top-0 right-0 mr-8 mt-16 flex justify-between  items-start gap-4">
        {editing ? (
          <>
            <button
              className="bg-cream text-orange-900 px-4 py-2 rounded disabled:opacity-50 cursor-pointer border-orange-900 border"
              onClick={() => setShowProductModal(false)}
            >
              Discard Changes
            </button>
            <button
              className="bg-brown text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer"
              onClick={() => handleComplete('complete')}
            >
              Save & Close
            </button>
          </>
        ) : (
          <>
            <button className=" text-orange-900 px-4 py-2 cursor-pointer" onClick={() => setShowProductModal(false)}>
              Discard
            </button>
            <button
              className="bg-cream text-orange-900 px-4 py-2 rounded disabled:opacity-50 cursor-pointer border-orange-900 border"
              onClick={() => handleComplete('draft')}
            >
              Save as Draft
            </button>
          </>
        )}
      </div>
      {saveMessage && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{saveMessage}</div>}

      {currentStep === 1 && (
        <div className="max-w-4xl bg-white py-16 px-8">
          <h2 className="h3 mb-18 pr-16">Add Product Info</h2>
          <Stepper
            config={config}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            stepsCompleted={stepsCompleted}
          />
          <ProductForm
            setProduct={setProduct}
            product={product}
            nextStep={stepOneNext}
            productFormError={productFormError}
          />
        </div>
      )}

      {currentStep === 2 && (
        <>
          <div className="px-8 pt-16">
            <h2 className="h3 mb-18 pr-16">Add Media</h2>
            <Stepper
              config={config}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              stepsCompleted={stepsCompleted}
            />
            <MediaTable
              item={item}
              showAddButton
              hideDeleteButton
              mediaIds={mediaIds}
              setMediaIds={setMediaIds}
              isUpdatingProductMedia={editing}
            />
          </div>
          <MediaTableProductButton setCurrentStep={setCurrentStep} stepTwoNext={stepTwoNext} />
        </>
      )}

      {currentStep === 3 && (
        <div className="px-8 py-16">
          <h2 className="h3 mb-18 pr-16">Review Produc</h2>
          <Stepper
            config={config}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            stepsCompleted={stepsCompleted}
          />
          <div className="pt-8">
            <ProductReview
              product={product!}
              mediaIds={mediaIds}
              setCurrentStep={setCurrentStep}
              handleComplete={handleComplete}
              setMediaIds={setMediaIds}
            />
          </div>
        </div>
      )}
    </>
  );
}
