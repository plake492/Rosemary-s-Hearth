import { Outlet, createFileRoute } from '@tanstack/react-router';
import AppPageWrapper from '@/components/App/AppPageWrapper';
import Navbar from '@/components/App/Navbar';
import Footer from '@/components/App/Footer';
import { Analytics } from '@vercel/analytics/react';
import { useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const routeUrl = router.state.location.pathname;

  const page =
    routeUrl === '/'
      ? 'homepage'
      : routeUrl.split('/').filter(Boolean).pop() || 'homepage';

  return (
    <>
      <Navbar />
      <AppPageWrapper id={page} bgColor="bg-cream">
        <Outlet />
      </AppPageWrapper>
      <Footer />
      <Analytics />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
