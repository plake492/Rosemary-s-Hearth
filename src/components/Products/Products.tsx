import ProductCard from './ProductCard';
import useGetProducts from '@/hooks/useGetProducts';

export default function Products() {
  const { products } = useGetProducts();

  return products.map((product) => (
    <ProductCard key={product.id} product={product} color="#000" />
  ));
}
