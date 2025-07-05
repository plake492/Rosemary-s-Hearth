import type { Tables } from '../../../database.types';

export default function ProductCard({
  item,
  color,
}: {
  item: Tables<'product'> & {
    media: Tables<'media'>[];
  };
  color: string | undefined;
}) {
  return (
    <div key={item.id} className={`p-4 rounded-lg bg-${color || 'sage'}`}>
      {item.media &&
        item.media.length > 0 &&
        item.media.map((media) => (
          <img
            key={media.id}
            src={media.url}
            alt={item.name || 'Product Image'}
            className="w-full aspect-[4/3] object-cover rounded-md"
          />
        ))}

      <h2 className="text-xl font-bold">{item.name}</h2>
      <p>{item.description}</p>
      <p className="text-lg">${item.price}</p>
    </div>
  );
}
