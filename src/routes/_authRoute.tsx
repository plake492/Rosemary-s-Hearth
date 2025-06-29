import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getSessionUser } from '@/utils/getSessionUser';

export const Route = createFileRoute('/_authRoute')({
  beforeLoad: async () => {
    const user = await getSessionUser();
    if (!user) throw redirect({ to: '/' });
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
