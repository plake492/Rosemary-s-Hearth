import UnderlayIcons from '@/components/UnderlayIcons';
import { useLayoutStore } from '@/state/layoutStore';

interface AppPageWrapperProps {
  children: React.ReactNode;
  id: string;
  bgColor?: string;
}

export default function AppPageWrapper({
  children,
  id,
  bgColor = 'bg-cream',
}: AppPageWrapperProps) {
  const { headerHeight } = useLayoutStore();

  return (
    <main
      id={id}
      className={`${bgColor} page relative flex flex-col`}
      style={{ minHeight: `calc(100dvh - ${headerHeight}px)` }}
    >
      <div className="px-4 xl:px-24 md:px-8 mt-2 md:mt-12 mb-16 md:mb-24 max-w-[1800px] mx-auto relative z-0">
        <UnderlayIcons />
        {children}
      </div>
    </main>
  );
}
