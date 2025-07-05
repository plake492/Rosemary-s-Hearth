import LinkCards from './LinkCards';
import { pageLinks } from '@/lib/siteLinks';
import { useOrderWindowCountdown } from '@/hooks/useOrderWindowCountdown';

export default function LinkSection() {
  const { countdown, showCTA } = useOrderWindowCountdown();

  return (
    <>
      {pageLinks.map((link) => (
        <LinkCards
          key={link.title}
          {...link}
          countdown={countdown}
          showCTA={showCTA}
        />
      ))}
    </>
  );
}
