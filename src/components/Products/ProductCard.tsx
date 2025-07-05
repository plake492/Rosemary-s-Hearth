import type { Tables } from '../../../database.types';

export default function ProductCard({
  product,
  color,
}: {
  product: Tables<'product'> & {
    media: Tables<'media'>[];
  };
  color: string | undefined;
}) {
  return (
    <div key={product.id} className={`p-4 rounded-lg bg-${color || 'sage'}`}>
      {product.media &&
        product.media.length > 0 &&
        product.media.map((media) => (
          <img
            key={media.id}
            src={media.url}
            alt={product.name || 'Product Image'}
            className="w-full aspect-[4/3] object-cover rounded-md"
          />
        ))}

      <h2 className="text-xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-lg">${product.price}</p>
    </div>
  );
}
