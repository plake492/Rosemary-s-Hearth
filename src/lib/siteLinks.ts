import * as Icons from '@/components/Icons';

export const pageLinks: {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  bgColor?: string;
}[] = [
  {
    title: 'Current Menu',
    href: '/menu',
    icon: 'KitchenItems',
    bgColor: 'rosemary',
  },
  {
    title: 'About Us',
    href: '/about',
    icon: 'Rosemary',
    bgColor: 'light-orange',
  },
  {
    title: 'Join the Bread Club',
    href: '/contact',
    icon: 'Bread',
    bgColor: 'sage',
  },
  {
    title: 'Order Now',
    href: '/blog',
    icon: 'BreadBasket',
    bgColor: 'sage',
  },
  {
    title: 'Book a Popup',
    href: '/faq',
    icon: 'Stars',
    bgColor: 'orange',
  },
  {
    title: 'Bread for our Neighbors',
    href: '/testimonials',
    icon: 'House',
    bgColor: 'rosemary',
  },
];
