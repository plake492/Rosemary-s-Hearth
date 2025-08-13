import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import SocialLinks from '@/components/SocialLinks';
import SideBar from '@/components/Home/SideBar';
import Products from '@/components/Products/Products';
import { useLayoutStore } from '@/state/layoutStore';
import { useMatchMedia } from '@/hooks/useMatchMedia';
import { fetchProductData } from './_actions/productActions';

// import LinkSection from '@/components/Home/LinkSection';

export const Route = createFileRoute('/_app/')({
  component: App,
  loader: async () => {
    const products = await fetchProductData(true);
    return { products };
  },
});

function App() {
  const { products } = useLoaderData({ from: '/_app/' });
  const { headerHeight } = useLayoutStore();
  const sidebarOffset = headerHeight;
  const isDesktop = useMatchMedia('(min-width: 48rem)');

  return (
    <>
      <section className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-24 items-center md:items-start">
        <aside
          className="max-w-full md:max-w-[200px] lg:max-w-[280px] w-full relative md:sticky mt-4 mb-12 md:mb-0 md:mt-[40px]"
          style={isDesktop ? { top: `${sidebarOffset}px` } : {}}
        >
          <SideBar />
          <div className="hidden md:block">
            <SocialLinks />
          </div>
        </aside>
        <section className="flex-1">
          {/* <LinkSection /> */}
          <Products items={products} />
        </section>
        <section className="block md:hidden mt-8">
          <SocialLinks />
        </section>
      </section>
    </>
  );
}
