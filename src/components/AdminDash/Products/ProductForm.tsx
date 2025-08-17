import React from 'react';
import Button from '@/components/Button';
import type { PartialProduct, ProductType } from '@/types';

interface ProductFormProps {
  product: PartialProduct | ProductType;
  setProduct: React.Dispatch<React.SetStateAction<PartialProduct>>;
  label?: string;
  nextStep?: () => void; // Optional function to handle next step
  productFormError: string[];
}

export default function ProductForm({ product, label, setProduct, nextStep, productFormError = [] }: ProductFormProps) {
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  return (
    <>
      {label && <h2 className="h3 mb-12">{label}</h2>}
      <form className="flex flex-col gap-4 max-w-full">
        {/* Name */}
        <div>
          <label className="flex flex-col gap-1">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={product?.name || ''}
              onChange={handleProductChange}
              className="border rounded p-2"
              required
            />
          </label>
          {productFormError.includes('name') && <p className="text-red-600 mt-2">Name is required.</p>}
        </div>
        {/* Price */}
        <div>
          <label className="flex flex-col gap-1">
            <span>Price</span>
            <input
              type="text"
              name="price"
              value={product.price || ''}
              onChange={handleProductChange}
              className="border rounded p-2"
              required
            />
          </label>
          {productFormError.includes('price') && (
            <p className="text-red-600 mt-2">Price is required and must be a valid number.</p>
          )}
        </div>
        {/* Description */}
        <label className="flex flex-col gap-1">
          <span>Description</span>
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleProductChange}
            className="border rounded p-2"
            rows={6}
            draggable="false"
          />
        </label>
        <div className="flex flex-row justify-between align-items-center">
          <Button type="button" onClick={nextStep} className="ml-auto cursor-pointer" disabled={productFormError.length > 0}>
            Continue
          </Button>
        </div>
      </form>
    </>
  );
}
