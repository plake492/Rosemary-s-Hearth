import React from 'react';
import useHandleMdeia from '@/hooks/useHandleMedia';
import useHandleProducts from '@/hooks/useHandleProducts';
import { createProduct, updateMediaOnProduct, addPriceQtyToProduct } from '@/routes/_dashboard/_actions/productActions';
import MediaTable from '../Media/MediaTable';
import MediaTableProductButton from '../Media/MediaTableProductButton';
import Stepper from '../Stepper';
import ProductForm from './ProductForm';
import ProductReview from './ProductReview';
import Button from '@/components/Button';
import type { ProductWithJoins, PartialProduct, MediaType, ProductStatus } from '@/types';
import type { PriceQtyFormRow } from './ProductFormPriceQty';

const config = [
  { step: 1, label: 'Product Info' },
  { step: 2, label: 'Product Media' },
  { step: 3, label: 'Review Product' },
];

interface ProductFlowProps {
  setShowProductModal: (value: boolean) => void;
  editing?: boolean;
  item?: ProductWithJoins;
}

export default function ProductFlow({ setShowProductModal, item, editing }: ProductFlowProps) {
  const { refreshProducts } = useHandleProducts({ skipUnpublished: false });
  const { refreshMedia } = useHandleMdeia();

  const [productFormError, setProductFormError] = React.useState<string[]>([]);
  const [saveMessage, setSaveMessage] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [mediaIds, setMediaIds] = React.useState<string[]>([]);
  const [stepsCompleted, setStepsCompleted] = React.useState<number[]>([]);
  const [priceQty, setPriceQty] = React.useState<PriceQtyFormRow[]>([{ id: 1, price: '', qty: '' }]);
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
    if (item) {
      if (item.media && item.media.length > 0) {
        setMediaIds(item.media?.map((media: MediaType) => media.uuid) || []);
      }
      if (item.priceQty && item.priceQty.length > 0) {
        // Convert database PriceQtyRow to form PriceQtyFormRow
        const formRows: PriceQtyFormRow[] = item.priceQty.map((pq) => ({
          id: pq.id,
          price: pq.price || '',
          qty: pq.qty || '',
        }));
        setPriceQty(formRows);
      }
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

  const handelAddMediaToProduct = async (uuid: string) => {
    if (mediaIds && mediaIds.length > 0) {
      const { error } = await updateMediaOnProduct({
        productId: uuid || product.uuid!,
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
    const required = { name: product.name };
    if (!product.name) {
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

    const mediaResult = await handelAddMediaToProduct(data?.uuid!);
    if (mediaResult?.error) return;

    await addPriceQtyToProduct({
      productId: data?.uuid!,
      priceQty: priceQty
        .filter((row): row is PriceQtyFormRow => row.price !== '' && row.qty !== '')
        .map((row) => ({
          price: Number(row.price),
          qty: Number(row.qty),
        })),
    });

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
      <div className="absolute top-0 right-0 mr-8 mt-12 flex justify-between  items-start gap-4">
        {editing ? (
          <>
            <Button variant="border" className="cursor-pointer" onClick={() => setShowProductModal(false)}>
              Discard Changes & Close
            </Button>
            <Button className="cursor-pointer" onClick={() => handleComplete('complete')}>
              Save & Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setShowProductModal(false)} variant="border" className="cursor-pointer">
              Discard & Close
            </Button>
            <Button onClick={() => handleComplete('draft')} className="cursor-pointer">
              Save as Draft
            </Button>
          </>
        )}
      </div>
      {saveMessage && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{saveMessage}</div>}

      {currentStep === 1 && (
        <div className="max-w-4xl bg-white py-12 px-8">
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
            setPriceQty={setPriceQty}
            priceQty={priceQty}
          />
        </div>
      )}

      {currentStep === 2 && (
        <>
          <div className="px-8 pt-12">
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
        <div className="px-8 py-12">
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
              priceQty={priceQty}
            />
          </div>
        </div>
      )}
    </>
  );
}
