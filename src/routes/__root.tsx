import React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  React.useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }

    setTimeout(() => {
      updateHeaderHeight();
    }, 300);
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [headerHeight]);

  return (
    <>
      <Navbar headerRef={headerRef} />
      <div
        className="relative flex flex-col"
        style={{ minHeight: `calc(100dvh - ${headerHeight}px)` }}
      >
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <Footer />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
