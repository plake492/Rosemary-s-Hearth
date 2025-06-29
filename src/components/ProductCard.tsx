import type { Product } from '../types/database';

export default function ProductCard({
  item,
  color,
}: {
  item: Product;
  color: string | undefined;
}) {
  return (
    <div key={item.id} className={`p-4 rounded-lg bg-${color || 'sage'}`}>
      <h2 className="text-xl font-bold">{item.name}</h2>
      <p>{item.description}</p>
      <p className="text-lg">${item.price}</p>
      <p className="text-sm">Created at: {item.created_at}</p>
    </div>
  );
}
