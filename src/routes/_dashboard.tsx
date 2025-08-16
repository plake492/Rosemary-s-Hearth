import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getSessionUser } from '@/utils/getSessionUser';
import AdminNav from '@/components/AdminDash/AdminNav';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async () => {
    const user = await getSessionUser();
    if (!user) throw redirect({ to: '/' });
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[250px_minmax(0,_1fr)]">
      <AdminNav />
      <section className="bg-cream min-h-screen px-24">
        <div className="container mx-auto p-4 mb-24">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
