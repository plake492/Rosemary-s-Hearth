import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';
import ProductCard from './ProductCard';
import useGetProducts from '@/hooks/useGetProducts';

export default function Products() {
  const { products } = useGetProducts();
  const { showCTA } = useOrderWindowCountdown();

  return (
    <div>
      <p className="h2 mb-8 text-center">The Menu</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, media: product.media ?? [] }}
            showCTA={showCTA}
          />
        ))}
      </div>
    </div>
  );
}
