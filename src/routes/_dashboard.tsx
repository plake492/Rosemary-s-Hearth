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
      <Outlet />
    </div>
  );
}
