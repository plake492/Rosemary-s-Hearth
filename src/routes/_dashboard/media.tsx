import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import MediaTable from '@/components/AdminDash/MediaTable';
import ModalWrapper from '@/components/ModalWrapper';
import MediaForm from '@/components/AdminDash/MediaForm';

export const Route = createFileRoute('/_dashboard/media')({
  component: RouteComponent,
});

function RouteComponent() {
  const [closeOverride, setCloseOverride] = React.useState(false);

  return (
    <section className="bg-cream min-h-screen px-24">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="h1">Media</h1>
        </div>
        <div>
          <div className="flex justify-end items-center mb-6">
            {/* <h2 className="pl-2 h3 mb-12 mt-6">Media Items</h2> */}
            <ModalWrapper
              closeOverride={closeOverride}
              trigger={
                <button className="bg-brown hover:bg-(--color-brown-hover) text-cream px-4 py-2 rounded shadow transition-colors cursor-pointer">
                  Add New Media Item
                </button>
              }
              style={{ maxWidth: '600px' }}
              className="max-w-4xl bg-white px-8 pb-16 pr-16"
            >
              <MediaForm closeModal={setCloseOverride} />
            </ModalWrapper>
          </div>
          <MediaTable />
        </div>
      </div>
    </section>
  );
}
