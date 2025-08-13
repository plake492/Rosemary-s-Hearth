import { createFileRoute } from '@tanstack/react-router';
import SocialLinks from '@/components/SocialLinks';
import SideBar from '@/components/Home/SideBar';
import UnderlayIcons from '@/components/UnderlayIcons';
import Products from '@/components/Products/Products';
import { useLayoutStore } from '@/state/layoutStore';
import { useMatchMedia } from '@/hooks/useMatchMedia';
// import LinkSection from '@/components/Home/LinkSection';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const { headerHeight } = useLayoutStore();
  const sidebarOffset = headerHeight;
  const isDesktop = useMatchMedia('(min-width: 48rem)');

  return (
    <>
      <main id="homepage" className="homepage bg-cream">
        <div className="px-4 xl:px-24 md:px-8 mt-2 md:mt-12 mb-16 md:mb-24 max-w-[1800px] mx-auto relative z-0">
          <UnderlayIcons />
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
              <Products />
            </section>
            <section className="block md:hidden mt-8">
              <SocialLinks />
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
