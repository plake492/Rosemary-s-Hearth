import { createFileRoute } from '@tanstack/react-router';
import ProductTable from '@/components/AdminDash/Products/ProductTable';
import DashContentWrapper from '@/components/AdminDash/DashContentWrapper';

export const Route = createFileRoute('/_dashboard/products')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="h1">Products</h1>
      </div>
      <DashContentWrapper>
        <ProductTable />
      </DashContentWrapper>
    </>
  );
}
