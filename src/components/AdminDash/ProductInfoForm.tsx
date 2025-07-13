import React from 'react';
import { supabase } from '@/lib/supabase';

export default function ProductForm({
  fetchProductData,
  product,
  isUpdating,
  setFormStep,
  formStep,
}: {
  fetchProductData: () => Promise<void>;
  product?: any;
  isUpdating?: boolean;
  setFormStep?: () => void;
  formStep?: 0 | 1;
}) {
  const [productForm, setProductForm] = React.useState(
    product || {
      name: '',
      price: '',
      description: '',
      uuid: '',
      link: '',
    },
  );
  const [productMessage, setProductMessage] = React.useState('');
  const [productLoading, setProductLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDeleteProduct = async () => {
    setProductLoading(true);
    const { error } = await supabase
      .from('product')
      .delete()
      .eq('uuid', productForm.uuid);
    if (error) {
      setProductMessage('Error deleting product.');
    } else {
      setProductMessage('Product deleted successfully.');
      await fetchProductData();
    }
    setProductLoading(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage('');
    // Insert new product
    const { error } = await supabase.from('product').upsert([
      {
        ...(productForm.id && { id: productForm.id }),
        name: productForm.name,
        price: productForm.price,
        description: productForm.description,
        link: productForm.link,
      },
    ]);
    if (error) {
      setProductMessage('Error adding product.');
    } else {
      setProductMessage(isUpdating ? 'Product updated!' : 'Product added!');
      setProductForm({
        name: '',
        price: '',
        description: '',
        uuid: '',
        link: '',
      });
      // Refresh product list
      await fetchProductData();
    }
    setProductLoading(false);
    setFormStep && setFormStep();
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  return (
    <div className="my-12 flex-1">
      <h2 className="h3 mb-4">
        {isUpdating ? 'Update Product' : 'Add Product'}
      </h2>
      <form
        className="flex flex-col gap-4 max-w-full"
        onSubmit={handleProductSubmit}
      >
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleProductChange}
            className="border rounded p-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Price</span>
          <input
            type="text"
            name="price"
            value={productForm.price}
            onChange={handleProductChange}
            className="border rounded p-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Link</span>
          <input
            type="text"
            name="link"
            value={productForm.link}
            onChange={handleProductChange}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Description</span>
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleProductChange}
            className="border rounded p-2"
            rows={6}
            draggable="false"
          />
        </label>
        <div className="flex flex-row justify-between align-items-center mb-4">
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
          {isUpdating && productForm.uuid && setFormStep && formStep === 0 && (
            <button
              type="button"
              className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors cursor-pointer"
              onClick={setFormStep}
            >
              <span className="mr-2">Update Photos</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        {productMessage && <p className="text-green-700">{productMessage}</p>}
      </form>

      {isUpdating && confirmDelete ? (
        <div>
          <p className="mb-4 my-8">
            Are you sure you want to delete this product?
          </p>
          <div className="flex">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex-1"
              onClick={handleDeleteProduct}
            >
              Confirm
            </button>
            <button
              className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors flex-1"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="block mt-4 px-4 py-2 roundedtransition-colors border border-red-500 text-red-500 hover:bg-red-100 rounded cursor-pointer ml-auto"
          onClick={() => {
            setConfirmDelete(true);
          }}
        >
          Delete Product
        </button>
      )}
    </div>
  );
}
