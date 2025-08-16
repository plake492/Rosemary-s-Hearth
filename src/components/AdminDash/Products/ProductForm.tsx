import React from 'react';
import DeleteConfirmation from '../DeleteConfirmation';
import ModalWrapper from '../../ModalWrapper';
import type { Tables } from '../../../../database.types';
import {
  handleDeleteProduct,
  createProduct,
} from '@/routes/_dashboard/_actions/productActions';

interface ProductFormProps {
  fetchProductData: () => Promise<void>;
  product?: Tables<'product'>;
  isUpdating?: boolean;
  setShowModal?: (value: boolean) => void;
  setInViewProductId?: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
  Stepper?: React.ReactNode; // Optional Stepper component
  onInsertProduct?: (product: Tables<'product'>) => void; // Callback for inserting product
}

export default function ProductForm({
  fetchProductData,
  product,
  isUpdating,
  setShowModal,
  setCurrentStep,
  label,
  onInsertProduct,
}: ProductFormProps) {
  const [productMessage, setProductMessage] = React.useState('');
  const [productLoading, setProductLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [productData, setProductData] = React.useState<
    Partial<Tables<'product'>>
  >(
    product || {
      name: '',
      price: '',
      description: '',
      uuid: '',
      link: '',
    },
  );

  const handleDelete = async () => {
    setProductLoading(true);
    const { error } = await handleDeleteProduct(productData.uuid as string);
    if (error) {
      setProductMessage('Error deleting product.');
    } else {
      setProductMessage('Product deleted successfully.');
      await fetchProductData();
    }
    if (setShowModal) {
      setShowModal(false);
    }
    setProductLoading(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage('');

    const { error, data } = await createProduct(productData);
    if (error) {
      setProductMessage('Error adding product.');
    } else {
      setProductMessage(isUpdating ? 'Product updated!' : 'Product added!');
      if (!isUpdating) {
        setCurrentStep && setCurrentStep(2);
        setProductData({
          name: '',
          price: '',
          description: '',
          uuid: '',
          link: '',
        });
        console.log('data ==>', data);
      }
      if (onInsertProduct && data) {
        onInsertProduct(data);
      }
      await fetchProductData();
    }
    setProductLoading(false);
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setProductData({ ...productData, [e.target.name]: e.target.value });

  return (
    <>
      {label && <h2 className="h3 mb-12">{label}</h2>}
      <form
        className="flex flex-col gap-4 max-w-full"
        onSubmit={handleProductSubmit}
      >
        {/* Name */}
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={productData.name || ''}
            onChange={handleProductChange}
            className="border rounded p-2"
            required
          />
        </label>
        {/* Price */}
        <label className="flex flex-col gap-1">
          <span>Price</span>
          <input
            type="text"
            name="price"
            value={productData.price || ''}
            onChange={handleProductChange}
            className="border rounded p-2"
            required
          />
        </label>
        {/* Link */}
        {/* <label className="flex flex-col gap-1">
          <span>Link</span>
          <input
            type="text"
            name="link"
            value={productData.link || ""}
            onChange={handleProductChange}
            className="border rounded p-2"
          />
        </label> */}
        {/* Description */}
        <label className="flex flex-col gap-1">
          <span>Description</span>
          <textarea
            name="description"
            value={productData.description || ''}
            onChange={handleProductChange}
            className="border rounded p-2"
            rows={6}
            draggable="false"
          />
        </label>
        <div className="flex flex-row justify-between align-items-center">
          {isUpdating && (
            <button
              className="px-4 py-2 roundedtransition-colors border border-red-500 text-red-500 hover:bg-red-100 rounded cursor-pointer"
              onClick={() => setConfirmDelete(true)}
              type="button"
            >
              Delete Product
            </button>
          )}
          <button
            type="submit"
            className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
            disabled={productLoading}
          >
            {productLoading
              ? 'Adding...'
              : isUpdating
                ? 'Update Product'
                : 'Add Product'}
          </button>
        </div>

        {productMessage && <p className="text-green-700">{productMessage}</p>}
      </form>

      <ModalWrapper
        showModal={confirmDelete}
        setShowModal={() => setConfirmDelete(false)}
        style={{ maxWidth: '600px', maxHeight: 'unset', minHeight: 'unset' }}
        className="max-w-4xl bg-white px-8 py-10 pr-16"
      >
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          label="Confirm Delete Product"
        />
      </ModalWrapper>
    </>
  );
}
