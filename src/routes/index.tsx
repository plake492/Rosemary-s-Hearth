import { createFileRoute } from '@tanstack/react-router';
import SocialLinks from '@/components/SocialLinks';
import SideBar from '@/components/Home/SideBar';
import UnderlayIcons from '@/components/UnderlayIcons';
import Products from '@/components/Products/Products';
// import LinkSection from '@/components/Home/LinkSection';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <>
      <main
        id="homepage"
        className="homepage container mx-auto overflow-hidden"
      >
        <UnderlayIcons />
        <section className="flex gap-4 min-h-[600px] flex-col md:flex-row items-center justify-center">
          <SideBar />
          <section className="flex-1 lg:p-8 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-auto md:w-full">
            {/* <LinkSection /> */}
            <Products />
          </section>
          <section className="flex pt-8 px-16 gap-4 md:hidden pb-12">
            <SocialLinks />
          </section>
        </section>
      </main>
    </>
  );
}
