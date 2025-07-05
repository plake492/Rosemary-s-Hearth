import { createFileRoute } from '@tanstack/react-router';
import Products from '@/components/Products/Products';

export const Route = createFileRoute('/menu')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main id="menu" className="bg-sage border-b-2 border-brown-800 flex-1">
      <section className={'menu container mx-auto overflow-hidden'}>
        <Products />
      </section>
    </main>
  );
}
