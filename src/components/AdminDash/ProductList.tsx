import React from 'react';
import ModalWrapper from '../ModalWrapper';
import ProductForm from './ProductInfoForm';
import useGetProducts from '@/hooks/useGetProducts';
import Product from './Product';

export default function ProductList() {
  const { products, fetchProductData, handleTogglePublished } = useGetProducts({
    skipUnpublished: false,
  });

  return (
    <div>
      <ul className="divide-y">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            handleTogglePublished={handleTogglePublished}
            fetchProductData={fetchProductData}
          />
        ))}
      </ul>
    </div>
  );
}
