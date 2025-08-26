import { Link, useLocation } from '@tanstack/react-router';

const navLinks = [
  { to: '/admin-dash', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/media', label: 'Media' },
  { to: '/order-window', label: 'Ordering Window' },
  { to: '/', label: 'View Site' },
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <nav className="admin-nav md:sticky top-0 md:h-screen w-full bg-sage border-r border-brown-200 flex flex-col py-8 px-4 gap-2 z-20 mr-24 border-b">
      <h2 className="text-lg font-bold mb-6 text-brown-700">Admin</h2>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.to;

        return (
          <Link
            key={link.to}
            to={link.to}
            className={`block py-2 px-4 rounded transition-colors font-medium text-lg ${
              isActive
                ? 'bg-brown-200 text-brown-900 font-semibold bg-(--color-sage-hover)'
                : 'text-brown-700 hover:bg-brown-100'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
