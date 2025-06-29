import { createFileRoute } from '@tanstack/react-router';
// import logo from '../assets/images/logo.svg';
import LinkCards from '@/components/LinkCards';
import * as Icons from '@/components/Icons';
import { pageLinks } from '@/lib/siteLinks';
import SocialLinks from '@/components/SocialLinks';
import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const { countdown, showCTA } = useOrderWindowCountdown();

  return (
    <>
      <main
        id="homepage"
        className={
          'homepage h-min-[calc(100%-56px+1rem)] pt-16 container mx-auto overflow-hidden'
        }
      >
        <aside className="fixed top-0 -z-1 w-full h-full">
          <div className="w-full h-full homepage-bg"></div>
          <div className="rosemary-bg one">
            <Icons.Rosemary />
          </div>
          <div className="rosemary-bg two">
            <Icons.Rosemary />
          </div>
        </aside>
        <div className="flex gap-4 min-h-[600px] flex-col md:flex-row items-center justify-center">
          <section className="max-w-sm w-100 flex flex-col items-center gap-4">
            <img src="/images/logo.svg" width={280} height={280} />
            <p className="h3 px-4 text-center uppercase">
              Every purchase helps us donate bread back to the community
            </p>
            <div className="md:flex pt-8 lg:px-16 md:px-8 px-2 gap-4 hidden">
              <SocialLinks />
            </div>
          </section>
          <section className="flex-1 lg:p-8 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-auto md:w-full">
            {pageLinks.map((link) => (
              <LinkCards
                key={link.title}
                {...link}
                countdown={countdown}
                showCTA={showCTA}
              />
            ))}
          </section>
          <div className="flex pt-8 px-16 gap-4 md:hidden pb-12">
            <SocialLinks />
          </div>
        </div>
      </main>
    </>
  );
}
