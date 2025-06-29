import { shopLink } from '@/lib/constants';
import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';

export default function Banner() {
  const { countdown, showCTA, windowCountdown } = useOrderWindowCountdown();

  return (
    <nav className="p-4 bg-brown grid place-items-center relative">
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
          <div className="mt-4 flex flex-col items-center gap-2">
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
    </nav>
  );
}
