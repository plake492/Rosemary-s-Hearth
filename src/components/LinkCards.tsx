import * as Icons from './Icons';

export default function LinkCards({
  title,
  href,
  icon,
  bgColor = 'sage',
}: {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  bgColor?: string;
}) {
  const IconComponent = Icons[icon || 'KitchenItems'];

  return (
    <a
      href={href}
      className={`flex flex-col items-center justify-center gap-4 py-8 px-2 rounded-lg bg-${bgColor} bg-hover transition-colors shadow-sm`}
    >
      <div className="mx-2 max-h-[180px] max-w-[180px] w-full flex items-center justify-center">
        <IconComponent />
      </div>
      <p className="h3 text-center">{title}</p>
    </a>
  );
}
