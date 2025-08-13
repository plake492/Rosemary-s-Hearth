import * as React from 'react';
import { useLayoutStore } from '@/state/layoutStore';

export default function Footer() {
  const { setFooterHeight, footerHeight } = useLayoutStore();
  const footerRef = React.useRef<HTMLHeadElement>(null);

  React.useLayoutEffect(() => {
    const watchFooterHeight = () => {
      !!footerRef?.current &&
        footerRef.current.offsetHeight !== footerHeight &&
        setFooterHeight(footerRef.current.offsetHeight);
    };

    setTimeout(watchFooterHeight, 100);

    window.addEventListener('resize', watchFooterHeight);
    return () => window.removeEventListener('resize', watchFooterHeight);
  }, [footerRef.current]);

  return (
    <footer className="bg-sage relative pb-safe" ref={footerRef}>
      <div className="container mx-auto py-4 text-center">
        <p className="text-sm text-brown-800">
          &copy; {new Date().getFullYear()} Rosemary's Hearth. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
