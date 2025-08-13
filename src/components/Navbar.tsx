import * as React from 'react';
import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';
import { shopLink } from '@/lib/constants';
import { RosemaryAlt } from './Icons';
import { useLayoutStore } from '@/state/layoutStore';

export default function Navbar() {
  const { countdown, showCTA, windowCountdown } = useOrderWindowCountdown();
  const { setHeaderHeight, headerHeight } = useLayoutStore();
  const headerRef = React.useRef<HTMLHeadElement>(null);

  React.useLayoutEffect(() => {
    const watchHeaderHeight = () => {
      !!headerRef?.current &&
        headerRef.current.offsetHeight !== headerHeight &&
        setHeaderHeight(headerRef.current.offsetHeight);
    };

    setTimeout(watchHeaderHeight, 100);

    window.addEventListener('resize', watchHeaderHeight);
    return () => window.removeEventListener('resize', watchHeaderHeight);
  }, [headerRef.current]);

  return (
    <header
      className="sticky top-0 z-50 w-full overflow-hidden"
      ref={headerRef}
    >
      <div className="py-2 bg-brown grid place-items-center relative z-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <div className="absolute -z-1 width-[349px] height-[120px] left-[32px] top-[-139px] transform rotate-[269deg] text-(--color-orange-hover)">
            <RosemaryAlt />
          </div>
          {!showCTA && (
            <p className="h4">
              <span className="secondary-font">Orders Open In:</span>{' '}
              <span>{countdown}</span>
            </p>
          )}
          {showCTA && (
            <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 w-full px-2 md:px-8 lg:px-12 xl:px-24 py-2 sm:py-0">
              <div className="col-start-1 md:col-start-2 justify-self-start md:justify-self-center">
                <p className="h4 secondary-font">Orders Open!</p>
                {windowCountdown && (
                  <div className="text-white text-lg mt-1 text-balance sm:block hidden">
                    Orders close in:{' '}
                    <span className="font-semibold">{windowCountdown}</span>
                  </div>
                )}
              </div>
              <div className="justify-self-end text-nowrap">
                <a
                  href={shopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cta bg-hover text-white px-6 py-3 rounded shadow-lg text-lg font-bold"
                >
                  Order Now
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className="bg-orange overflow-hidden px-2 md:px-8 lg:px-12 xl:px-24">
        <div className="max-w-[1800px] mx-auto">
          <a href="/" className="h4 secondary-font flex items-center gap-2">
            <img
              src="/images/logo.svg"
              width={'100%'}
              height={'100%'}
              className="mix-blend-luminosity pt-0.5 pb-1 w-[50px] md:w-[75px]"
              alt="Rosemary's Hearth Logo"
            />
            <p className="bold">Rosemary's Hearth</p>
          </a>

          {/* //* For Navbar */}
          {/* <p className="align-self-end justify-self-end cursor-pointer">
          <img
            src="/images/icons/hamburger.png"
            width={36}
            height={36}
            className="mix-blend-luminosity py-0.5"
          />
        </p> */}
        </div>
      </nav>
    </header>
  );
}
