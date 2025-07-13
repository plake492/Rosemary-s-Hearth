import React from 'react';

export default function ProductImageCarousel({
  images,
  alt,
}: {
  images: { id: string | number; url: string }[];
  alt: string;
}) {
  const [index, setIndex] = React.useState(0);
  if (!images || images.length === 0) return null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        <img
          src={images[index].url}
          alt={alt}
          className="aspect-[4/3] object-cover rounded-md w-full"
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 text-brown-700 rounded-full p-1 shadow transition-colors"
              style={{ zIndex: 2 }}
              onClick={prev}
              aria-label="Previous image"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 text-brown-700 rounded-full p-1 shadow transition-colors"
              style={{ zIndex: 2 }}
              onClick={next}
              aria-label="Next image"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-1 mt-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`block w-2 h-2 rounded-full border border-brown-300 focus:outline-none transition-colors ${i === index ? 'bg-brown' : 'bg-transparent'}`}
              style={{ cursor: 'pointer' }}
              aria-label={`Go to image ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
