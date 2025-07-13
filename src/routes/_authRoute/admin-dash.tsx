import OrderWindowForm from '@/components/AdminDash/OrderWindowForm';
import ProductList from '@/components/AdminDash/ProductList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authRoute/admin-dash')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="bg-cream">
      <div className="container mx-auto p-4">
        <div>
          <h1 className="h1">Admin Dash</h1>
          <hr />
        </div>
        <div className="grid grid-cols-2 mt-8">
          <OrderWindowForm />
          <ProductList />
        </div>
      </div>
    </section>
  );
}
