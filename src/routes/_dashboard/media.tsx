import { createFileRoute } from '@tanstack/react-router';
import MediaTable from '@/components/AdminDash/Media/MediaTable';
import DashContentWrapper from '@/components/AdminDash/DashContentWrapper';

export const Route = createFileRoute('/_dashboard/media')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="h1">Media</h1>
      </div>
      <DashContentWrapper>
        <MediaTable />
      </DashContentWrapper>
    </>
  );
}
