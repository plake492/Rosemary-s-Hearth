import { createFileRoute } from '@tanstack/react-router';
import MediaTable from '@/components/AdminDash/MediaTable';

export const Route = createFileRoute('/_dashboard/media')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="h1">Media</h1>
      </div>
      <div>
        <MediaTable />
      </div>
    </>
  );
}
