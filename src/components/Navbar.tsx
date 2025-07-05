import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';
import { shopLink } from '@/lib/constants';
import { RosemaryAlt } from './Icons';

export default function Navbar({
  headerRef,
}: {
  headerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { countdown, showCTA, windowCountdown } = useOrderWindowCountdown();

  return (
    <header
      className="sticky top-0 z-50 w-full overflow-hidden"
      ref={headerRef}
    >
      <div className="px-4 py-2 bg-brown grid place-items-center relative z-1 overflow-hidden">
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
          <>
            <p className="h4">
              <span className="secondary-font">Orders Open!</span>
            </p>
            <div className="flex flex-col items-center gap-2">
              <a
                href={shopLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cta bg-hover text-white px-6 py-3 rounded shadow-lg text-lg font-bold absolute right-0 top-[50%] translate-y-[-50%] mr-8"
              >
                Order Now
              </a>
              {windowCountdown && (
                <div className="text-white text-lg mt-1">
                  Orders close in:{' '}
                  <span className="font-semibold">{windowCountdown}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <nav className="bg-orange overflow-hidden justify-between grid grid-cols-2 items-center gap-4 px-8">
        <a href="/" className="h4 secondary-font flex items-center gap-2">
          <img
            src="/images/logo.svg"
            width={75}
            height={75}
            className="mix-blend-luminosity pt-0.5 pb-1"
            alt="Rosemary's Hearth Logo"
          />
          <p>
            <b>Rosemary's Hearth</b>
          </p>
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
      </nav>
    </header>
  );
}
