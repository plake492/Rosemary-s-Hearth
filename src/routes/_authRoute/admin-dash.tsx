import OrderWindowForm from '@/components/AdminDash/OrderWindowForm';
import ProductForm from '@/components/AdminDash/ProductForm';
import ProductList from '@/components/AdminDash/ProductList';
import useGetProducts from '@/hooks/useGetProducts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authRoute/admin-dash')({
  component: RouteComponent,
});

function RouteComponent() {
  const { products, setProducts } = useGetProducts();

  return (
    <div className="bg-cream container mx-auto p-4">
      <h1 className="h1">Admin Dash</h1>
      <div className="grid grid-cols-3">
        <OrderWindowForm />
        <ProductForm product={null} setProductList={setProducts} />
        <ProductList productList={products} setProductList={setProducts} />
      </div>
    </div>
  );
}
