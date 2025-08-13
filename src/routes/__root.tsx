import { Outlet, createRootRoute } from '@tanstack/react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { useLayoutStore } from '@/state/layoutStore';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { headerHeight } = useLayoutStore();

  return (
    <>
      {/* <Navbar /> */}
      <div
        className="relative flex flex-col"
        style={{ minHeight: `calc(100dvh - ${headerHeight}px)` }}
      >
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <Footer />
        <div className="h-12 block sm:hidden" />
      </div>
      <Analytics />

      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
