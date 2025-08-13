import Products from '@/components/Products/Products';
import { createFileRoute } from '@tanstack/react-router';
import { fetchProductData } from './_actions/productActions';
import { useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/menu')({
  component: RouteComponent,
  loader: async () => {
    const products = await fetchProductData(true);
    return { products };
  },
});

function RouteComponent() {
  const { products } = useLoaderData({ from: '/_app/menu' });

  return (
    <section className="menu container mx-auto overflow-hidden">
      <Products items={products} />
    </section>
  );
}
