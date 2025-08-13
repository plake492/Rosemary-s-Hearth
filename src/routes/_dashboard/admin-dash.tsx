import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/admin-dash')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="h1">Dashboard</h1>
      </div>
    </>
  );
}
