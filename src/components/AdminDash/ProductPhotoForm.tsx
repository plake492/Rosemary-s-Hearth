import React from 'react';
import { supabase } from '@/lib/supabase';
import useGetProducts from '@/hooks/useGetProducts';

export default function ProductPhotoForm({
  product,
  isUpdating,
  setFormStep,
}: {
  product?: any;
  isUpdating?: boolean;
  setFormStep?: () => void;
}) {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageName, setImageName] = React.useState('');
  const [altText, setAltText] = React.useState('');
  const [imageUrls, setImageUrls] = React.useState<string[]>(
    product?.media.map((media: any) => media.url) || [],
  );
  const [productMessage, setProductMessage] = React.useState('');
  const [productLoading, setProductLoading] = React.useState(false);
  const [photoToUpdate, setPhotoToUpdate] = React.useState<number | null>(null);
  const [photoToUpdateIndex, setPhotoToUpdateIndex] = React.useState<
    number | null
  >(null);

  const { fetchProductData } = useGetProducts();

  React.useEffect(() => {
    const id = setTimeout(() => {
      setProductMessage('');
    }, 5000);
    return () => clearTimeout(id);
  }, [productMessage]);

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setProductMessage('Please select a file to upload.');
      return;
    }
    if (!altText) {
      setProductMessage('Please provide alt text for the image.');
      return;
    }

    setProductLoading(true);

    if (imageFile.size > 5 * 1024 * 1024) {
      setProductMessage('File size exceeds 5MB limit.');
      setProductLoading(false);
      return;
    }

    const { data, error } = await supabase.storage
      .from('product-photos')
      .upload(`${product.uuid}/${imageFile.name}`, imageFile);
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

    const photoUrl = `${siteUrl}/storage/v1/object/public/product-photos/${product.uuid}/${imageFile.name}`;

    // Insert into media table
    const mediaInsert = await supabase
      .from('media')
      .upsert([
        {
          ...(photoToUpdate && { id: photoToUpdate }),
          url: photoUrl,
          name: imageName,
          alt: altText,
        },
      ])
      .select()
      .single();

    if (photoToUpdate) {
      setProductMessage('Image updated successfully.');
      setPhotoToUpdateIndex(null);
      setPhotoToUpdate(null);
      //   fetchProductData();
      return;
    }

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

    setImageUrls((prev) => [...prev, photoUrl]);
    setProductMessage('File uploaded and linked successfully.');
    setProductLoading(false);
    console.log('File uploaded and linked:', data, mediaInsert.data);
    fetchProductData();
  };

  const handlePhotoClick = (url: string, index: number) => {
    const mediaToUpdate = product.media.find((media: any) => media.url === url);
    if (mediaToUpdate) {
      setPhotoToUpdate(mediaToUpdate.id);
      setImageName(mediaToUpdate.name || '');
      setAltText(mediaToUpdate.alt || '');
      setPhotoToUpdateIndex(index);
    }
  };

  const removeImageToUpdate = () => {
    setPhotoToUpdate(null);
    setImageName('');
    setAltText('');
    setPhotoToUpdateIndex(null);
  };

  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <h2 className="h3 mb-4">
          {isUpdating ? 'Update Images' : 'Add Images'}
        </h2>
        <label className="flex flex-col gap-1 mb-6">
          <span>Image Name</span>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="border rounded p-2"
          />
        </label>

        <label className="flex flex-col gap-1 mb-6">
          <span className="cursor-pointer">File Upload</span>
          <input
            type="file"
            onChange={handleAddFile}
            className="border rounded p-2 h-32"
          />
        </label>

        <label className="flex flex-col gap-1 mb-6">
          <span>Alt</span>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <div className="flex flex-row justify-between align-items-center mb-4">
          <div className="flex">
            <button
              type="submit"
              className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
              disabled={productLoading}
            >
              {productLoading
                ? 'Adding...'
                : isUpdating && !photoToUpdate
                  ? 'Add Image'
                  : 'Update Image'}
            </button>
            {isUpdating && photoToUpdate && setFormStep && (
              <button
                type="button"
                className="ml-4 bg-orange text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer"
                onClick={removeImageToUpdate}
              >
                Cancel Update
              </button>
            )}
          </div>
          {setFormStep && (
            <button
              type="button"
              className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors cursor-pointer"
              onClick={setFormStep}
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Info</span>
            </button>
          )}
        </div>
        {productMessage && <p className="text-green-700">{productMessage}</p>}
      </form>
      {imageUrls.length > 0 && (
        <div className="mt-8">
          <h3 className="h4 mb-4">Current Images</h3>
          <div className="flex gap-4 overflow-x-auto">
            {imageUrls.map((url, index) => (
              <span
                key={index}
                onClick={() => handlePhotoClick(url, index)}
                className="cursor-pointer"
                style={{
                  border:
                    photoToUpdateIndex === index ? '2px solid #fff' : 'none',
                  boxShadow:
                    photoToUpdateIndex === index
                      ? '0 0 10px rgba(0, 0, 0, 0.5)'
                      : 'none',
                }}
              >
                <img
                  src={url}
                  alt={altText || 'Product Image'}
                  className="w-32 h-32 object-cover rounded"
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
