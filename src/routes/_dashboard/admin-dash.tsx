// import OrderWindowForm from '@/components/AdminDash/OrderWindowForm';
import ProductList from '@/components/AdminDash/ProductList';
import { createFileRoute } from '@tanstack/react-router';
import MediaTable from '@/components/AdminDash/MediaTable';
import ModalWrapper from '@/components/ModalWrapper';

export const Route = createFileRoute('/_dashboard/admin-dash')({
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
        {/* <div className="grid grid-cols-2 mt-8"> */}
        {/* <OrderWindowForm /> */}
        <ProductList />
        {/* </div> */}
      </div>
      <ModalWrapper
        trigger={
          <button className="fixed bottom-8 right-8 bg-brown text-cream px-4 py-2 rounded-full shadow-lg hover:bg-brown-dark transition-colors cursor-pointer z-50">
            Manage Media
          </button>
        }
        className="max-w-4xl bg-white px-8 pb-16"
      >
        <MediaTable showAddButton />
      </ModalWrapper>
    </section>
  );
}
