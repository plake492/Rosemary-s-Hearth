import { createFileRoute } from '@tanstack/react-router';
import Products from '@/components/Products';

export const Route = createFileRoute('/menu')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Products />
    </div>
  );
}
