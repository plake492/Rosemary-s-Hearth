import React from 'react';

export default function DashContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4 bg-white rounded-md">{children}</div>;
}
