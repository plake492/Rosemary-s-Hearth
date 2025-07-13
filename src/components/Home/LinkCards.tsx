import * as Icons from '@/components/Icons';

export default function LinkCards({
  title,
  href,
  icon,
  bgColor = 'sage',
  isOrder = false,
  linkProps = {},
  countdown,
  showCTA,
}: {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  bgColor?: string;
  isOrder?: boolean;
  linkProps?: {
    target?: string;
    rel?: string;
  };
  countdown?: string;
  showCTA?: boolean;
}) {
  const IconComponent = Icons[icon || 'KitchenItems'];

  const highlightCard = isOrder && showCTA;
  const showCountdown = isOrder && countdown && !showCTA;
  const useHref = showCTA ? href : '#';

  return (
    <a
      href={isOrder ? useHref : href}
      {...(isOrder && !showCountdown && linkProps)}
      className={`flex flex-col items-center justify-center gap-4 py-8 px-6 rounded-lg bg-${bgColor} bg-hover transition-colors  ${highlightCard ? 'border-4 border-(--color-orange) shadow-lg ' : ''}`}
    >
      <div className="mx-2 max-h-[180px] max-w-[180px] w-full flex items-center justify-center">
        <IconComponent />
      </div>
      <p className="h3 text-center">
        {showCountdown ? `Order in: ${countdown}` : title}
      </p>
    </a>
  );
}
