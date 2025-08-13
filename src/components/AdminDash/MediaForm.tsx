import React from 'react';
import IconButton from '@/components/IconButton';
import { BaselineDelete } from '@/components/Svg';
import { FileUploader } from 'react-drag-drop-files';
import useMediaPicker from '@/hooks/useMediaPicker';
import type { Tables } from '../../../database.types';

export default function MediaForm({
  closeModal,
  isUpdating,
  item,
}: {
  closeModal: (value: boolean) => void;
  isUpdating?: boolean;
  item?: Tables<'media'>;
}) {
  const [mediaName, setMediaName] = React.useState(item?.name || '');
  const [altText, setAltText] = React.useState(item?.alt || '');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    item?.url || null,
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [mediaMessage, setMediaMessage] = React.useState('');
  const [mediaLoading, setMediaLoading] = React.useState(false);

  const { uploadMedia, updateMediaItem } = useMediaPicker();

  React.useEffect(() => {
    const id = setTimeout(() => {
      setMediaMessage('');
    }, 5000);
    return () => clearTimeout(id);
  }, [mediaMessage]);

  const handleFileAdd = (file: File | File[]) => {
    if ((file as File).size > 5 * 1024 * 1024) {
      setMediaMessage('File size exceeds 5MB limit.');
      return;
    }
    setImageFile(file as File);
    setPreviewUrl(URL.createObjectURL(file as File));
  };

  const handleFileUpload = async () => {
    if (!imageFile) {
      setMediaMessage('Please select a file to upload.');
      return;
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      setMediaMessage('File size exceeds 5MB limit.');
      return;
    }

    try {
      await uploadMedia({ file: imageFile, name: mediaName, alt: altText });
    } catch (error) {
      setMediaMessage('Error uploading media. Please try again.');
    } finally {
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!mediaName) {
        setMediaMessage('Please provide a name for the media item.');
        return;
      }
      if (!altText) {
        setMediaMessage('Please provide alt text for the image.');
        return;
      }

      if (isUpdating && item) {
        await updateMediaItem(item.uuid, {
          name: mediaName,
          alt: altText,
        });
      } else {
        await handleFileUpload();
      }

      closeModal(true);
    } catch (error) {
      setMediaMessage('Error processing request. Please try again.');
    } finally {
      setMediaLoading(false);
    }
  };

  return (
    <div className="my-12">
      <form onSubmit={onSubmit}>
        <h2 className="h3 mb-12">
          {isUpdating ? 'Update Media' : 'Add Media'}
        </h2>
        <div className="grid grid-cols-1 gap-8 mb-8">
          {!isUpdating && (
            <div>
              <span className="font-semibold text-brown-700 mb-2">Media</span>
              <FileUploader
                name="file"
                types={['jpg', 'jpeg', 'png', 'gif']}
                classes="file-uploader"
                label=""
                onDrop={handleFileAdd}
                handleChange={handleFileAdd}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <svg
                    className="w-12 h-12 text-brown-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  <span className="text-brown-600 text-sm font-medium">
                    Click or drag to upload
                  </span>
                  <span className="text-xs text-brown-400 mt-1">
                    JPG, PNG, GIF up to 5MB
                  </span>
                </div>
              </FileUploader>
            </div>
          )}

          {previewUrl && (
            <div className="relative flex items-center gap-8 aspect-ratio-1/1 w-66 h-66">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded border"
              />
              {!isUpdating && (
                <IconButton
                  className="absolute top-0 right-0 m-1 bg-white/80 text-red-600 rounded-full w-10 h-10 p-2 flex items-center justify-center hover:bg-red-100 z-10"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  aria-label="Remove preview"
                >
                  <BaselineDelete />
                </IconButton>
              )}
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1 mb-6">
          <span>Alt</span>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1 mb-6">
          <span>Image Name</span>
          <input
            type="text"
            value={mediaName}
            onChange={(e) => setMediaName(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <div className="flex flex-row justify-between align-items-center mb-4">
          <div className="flex">
            <button
              type="submit"
              className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
              disabled={mediaLoading}
            >
              {mediaLoading
                ? isUpdating
                  ? 'Updating...'
                  : 'Adding...'
                : isUpdating
                  ? 'Edit Media'
                  : 'Add Media'}
            </button>
          </div>
        </div>

        {mediaMessage && <p className="text-red-700">{mediaMessage}</p>}
      </form>
    </div>
  );
}
