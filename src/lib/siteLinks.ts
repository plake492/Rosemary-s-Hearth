import * as Icons from '@/components/Icons';
import { shopLink } from '@/lib/constants';

export const pageLinks: {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  bgColor?: string;
  isOrder?: boolean;
  linkProps?: {
    target?: string;
    rel?: string;
  };
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
    href: shopLink,
    icon: 'BreadBasket',
    bgColor: 'sage',
    isOrder: true,
    linkProps: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
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
