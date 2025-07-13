import type { Tables } from '../../../database.types';
import ProductImageCarousel from './ProductImageCarousel';

export default function ProductCard({
  product,
  showCTA,
}: {
  product: Tables<'product'> & {
    media: Tables<'media'>[];
  };
  showCTA?: boolean;
}) {
  return (
    <div key={product.id} className={`w-full p-4 rounded-lg bg-${'rosemary'}`}>
      <div className="flex flex-col justify-between h-full">
        {product.media && product.media.length > 0 && (
          <ProductImageCarousel
            images={product.media}
            alt={product.name || 'Product Image'}
          />
        )}
        <div className="flex flex-col jusrify-between h-full">
          <div>
            <h3 className="text-xl font-bold text-balance mb-4 mt-2">
              {product.name}
            </h3>
            <p className="mb-4">{product.description}</p>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {product.link && showCTA ? (
            <a
              href={product.link}
              className=" hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
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
