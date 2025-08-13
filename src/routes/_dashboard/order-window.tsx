import { createFileRoute } from '@tanstack/react-router';
import OrderWindowForm from '@/components/AdminDash/OrderWindowForm';

export const Route = createFileRoute('/_dashboard/order-window')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mb-8">
      <h1 className="h1">Order Window</h1>
      <OrderWindowForm />
    </div>
  );
}
