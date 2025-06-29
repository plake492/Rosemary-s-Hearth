import { Outlet, createRootRoute } from '@tanstack/react-router';
import Banner from '@/components/Banner';
// import Navbar from '@/components/Navbar';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <Banner />
      <div className="relative">
        {/* <header className="px-2 md:px-4 container mx-auto absolute top-2 left-[50%] translate-x-[-50%] rounded-lg">
          <Navbar />
        </header> */}
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
