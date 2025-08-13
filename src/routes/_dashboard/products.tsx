import { createFileRoute } from '@tanstack/react-router';
import ProductList from '@/components/AdminDash/ProductList';
import DataSearchBar from '@/components/AdminDash/DataSearchBar';

export const Route = createFileRoute('/_dashboard/products')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="h1">Products</h1>
      </div>
      <DataSearchBar />
      <ProductList />
    </>
  );
}
