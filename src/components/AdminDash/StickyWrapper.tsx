import React from 'react';

export default function StickyWrapper({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0 bg-white z-10 pt-2 pb-2 border-b-2">{children}</div>;
}
