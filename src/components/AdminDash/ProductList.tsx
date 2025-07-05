import React from 'react';
import ModalWrapper from '../ModalWrapper';
import ProductForm from './ProductForm';

export default function ProductList({
  productList,
  setProductList,
}: {
  productList: any[];
  setProductList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <div className="mt-8">
      <h3 className="h3 mb-2">Current Products</h3>
      <ul className="divide-y">
        {productList.map((prod) => (
          <li
            key={prod.id}
            className="flex flex-col align-items-start gap-2 py-2"
          >
            {prod.media &&
              prod.media.length > 0 &&
              prod.media.map((media: any) => (
                <img
                  key={media.id}
                  src={media.url}
                  alt={prod.name}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            <span className="h5 align-sub">
              <strong className="h3">{prod.name}</strong> — ${prod.price}
            </span>
            <span className="text-sm text-gray-700">{prod.description}</span>
            <ModalWrapper
              trigger={
                <button className="mt-4 bg-brown text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer">
                  Edit Product
                </button>
              }
              className="max-w-lg"
            >
              <div>
                <ProductForm product={prod} setProductList={setProductList} />
              </div>
            </ModalWrapper>
          </li>
        ))}
      </ul>
    </div>
  );
}
