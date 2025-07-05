import React from 'react';
import { supabase } from '@/lib/supabase';

export default function ProductForm({
  setProductList,
  product,
}: {
  setProductList: React.Dispatch<React.SetStateAction<any[]>>;
  product?: any;
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
  const [imageName, setImageName] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage('');
    // Insert new product
    const { error } = await supabase.from('product').insert([
      {
        name: productForm.name,
        price: productForm.price,
        description: productForm.description,
      },
    ]);
    if (error) {
      setProductMessage('Error adding product.');
    } else {
      setProductMessage('Product added!');
      setProductForm({
        name: '',
        price: '',
        description: '',
        uuid: '',
        link: '',
      });
      // Refresh product list
      const { data } = await supabase.from('product').select();
      if (data) setProductList(data);
    }
    setProductLoading(false);
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    product: typeof productForm,
  ) => {
    if (!product.uuid) {
      // Handle case where product UUID is not available
      setProductMessage('Product UUID is required for file upload.');
      setProductLoading(false);
      return;
    }

    if (!product.name) {
      // Handle case where product name is not available
      setProductMessage('Product name is required for file upload.');
      setProductLoading(false);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    setProductLoading(true);
    const { data, error } = await supabase.storage
      .from('product-photos')
      .upload(`${product.uuid}/${imageName}`, file);
    if (error) {
      setProductMessage('Error uploading file.');
      setProductLoading(false);
      return;
    }

    const siteUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!siteUrl) {
      setProductMessage('Supabase URL is not configured.');
      setProductLoading(false);
      return;
    }

    // Insert into media table
    const mediaInsert = await supabase
      .from('media')
      .insert([
        {
          url:
            `${siteUrl}/storage/v1/object/public/product-photos/${product.uuid}/${imageName}` ||
            '',
          name: imageName,
        },
      ])
      .select()
      .single();

    if (mediaInsert.error || !mediaInsert.data) {
      console.error('Error inserting media - Data:', mediaInsert);
      console.error('Error inserting media:', mediaInsert.error);
      setProductMessage('File uploaded, but failed to save media record.');
      setProductLoading(false);
      return;
    }

    // Insert into product_media pivot table
    const pivotInsert = await supabase.from('product_media').insert([
      {
        product_id: product.uuid,
        media_id: mediaInsert.data.uuid,
      },
    ]);

    if (pivotInsert.error) {
      setProductMessage('File uploaded, but failed to link product and media.');
      setProductLoading(false);
      return;
    }

    setProductMessage('File uploaded and linked successfully.');
    setProductLoading(false);
    console.log('File uploaded and linked:', data, mediaInsert.data);
  };

  return (
    <div className="mt-12 flex-1">
      <h2 className="h3 mb-4">Add Product</h2>
      <form
        className="flex flex-col gap-4 max-w-md"
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
            rows={3}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>File Upload</span>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, productForm)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Image Name</span>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="border rounded p-2"
          />
        </label>

        <button
          type="submit"
          className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50"
          disabled={productLoading}
        >
          {productLoading ? 'Adding...' : 'Add Product'}
        </button>
        {productMessage && <p className="text-green-700">{productMessage}</p>}
      </form>
    </div>
  );
}
