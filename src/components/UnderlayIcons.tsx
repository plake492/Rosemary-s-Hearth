import * as Icons from '@/components/Icons';

export default function UnderlayIcons() {
  return (
    <aside className="fixed top-0 -z-1 w-full h-full">
      <div className="hidden xl:block absolute top-[200px] left-[200px] w-full h-full rosemary-bg">
        <Icons.RosemaryAlt />
      </div>
      <div className="rosemary-bg one">
        <Icons.Rosemary />
      </div>
      <div className="rosemary-bg two">
        <Icons.Rosemary />
      </div>
    </aside>
  );
}
