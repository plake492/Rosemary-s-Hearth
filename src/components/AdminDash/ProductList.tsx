import React from 'react';
import ModalWrapper from '../ModalWrapper';
import ProductForm from './ProductInfoForm';
import useGetProducts from '@/hooks/useGetProducts';
import ProductPhotoForm from './ProductPhotoForm';

export default function ProductList() {
  const { products, fetchProductData } = useGetProducts();
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
          {formStep === 0 && (
            <ProductForm product={null} fetchProductData={fetchProductData} />
          )}
          {formStep === 1 && <ProductPhotoForm />}
        </ModalWrapper>
      </div>
      <ul className="divide-y max-h-[70dvh] overflow-y-auto">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col align-items-start gap-2 py-2"
          >
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
            <ModalWrapper
              trigger={
                <button className="mt-4 bg-brown text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer">
                  Edit Product
                </button>
              }
              className="max-w-lg"
            >
              {formStep === 0 && (
                <ProductForm
                  product={product}
                  fetchProductData={fetchProductData}
                  isUpdating
                  setFormStep={() => setFormStep(1)}
                  formStep={formStep}
                />
              )}
              {formStep === 1 && (
                <ProductPhotoForm
                  product={product}
                  isUpdating
                  setFormStep={() => setFormStep(0)}
                />
              )}
            </ModalWrapper>
          </li>
        ))}
      </ul>
    </div>
  );
}
