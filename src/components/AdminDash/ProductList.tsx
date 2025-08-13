import React from 'react';
import ModalWrapper from '../ModalWrapper';
import ProductForm from './ProductInfoForm';
import useGetProducts from '@/hooks/useGetProducts';
import MediaForm from './MediaForm';
import Product from './Product';

export default function ProductList() {
  const { products, fetchProductData, handleTogglePublished } = useGetProducts({
    skipUnpublished: false,
  });
  const [formStep, setFormStep] = React.useState<0 | 1>(0);

  return (
    <div>
      <div className="flex justify-between align-items-center mb-4 p-4 bg-brown rounded">
        <h3 className="h3">Current Products</h3>
        <ModalWrapper
          trigger={
            <button className="bg-orange text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer">
              Add Product
            </button>
          }
          className="max-w-lg"
        >
          <div className="grid grid-cols-2 gap-24">
            <ProductForm product={null} fetchProductData={fetchProductData} />
            <MediaForm />
          </div>
          {/* {formStep === 0 && (
            <ProductForm product={null} fetchProductData={fetchProductData} />
          )}
          {formStep === 1 && <MediaForm />} */}
        </ModalWrapper>
      </div>
      <ul className="divide-y">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            handleTogglePublished={handleTogglePublished}
            fetchProductData={fetchProductData}
            formStep={formStep}
            setFormStep={setFormStep}
          />
        ))}
      </ul>
    </div>
  );
}
