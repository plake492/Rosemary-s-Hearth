import ProductImageCarousel from './ProductImageCarousel';
import type { ProductWithMedia } from '@/types';

interface ProductCardProps {
  product: ProductWithMedia;
  showCTA?: boolean;
}

export default function ProductCard({ product, showCTA }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className={`w-full p-4 rounded-lg bg-rosemary hover:transform hover:scale-[1.02] hover:shadow-sm transition-transform duration-200`}
    >
      <div className="flex flex-col justify-between h-full">
        {product.media && product.media.length > 0 && (
          <ProductImageCarousel images={product.media} alt={product.name || 'Product Image'} />
        )}
        <div className="flex flex-col jusrify-between h-full">
          <div>
            <h3 className="text-xl font-bold text-balance mb-4 mt-2">{product.name}</h3>
            <p className="mb-4">{product.description}</p>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {product.link && showCTA ? (
            <a href={product.link} className=" hover:underline" target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          ) : (
            <span></span>
          )}
          <p className="h4 text-bold justify-self-end">${product.price}</p>
        </div>
      </div>
    </div>
  );
}
