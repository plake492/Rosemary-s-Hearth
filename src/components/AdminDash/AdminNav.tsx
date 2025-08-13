import { Link, useRouter } from '@tanstack/react-router';

const navLinks = [
  { to: '/admin-dash', label: 'Dashboard' },
  { to: '/media', label: 'Media' },
  { to: '/_authRoute/admin-orders', label: 'Orders' },
  { to: '/_authRoute/admin-users', label: 'Users' },
  // Add more links as needed
];

export default function AdminNav() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <nav className="admin-nav sticky top-0 h-screen w-full bg-sage border-r border-brown-200 flex flex-col py-8 px-4 gap-2 z-20 mr-24 border-b">
      <h2 className="text-lg font-bold mb-6 text-brown-700">Admin</h2>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`block py-2 px-4 rounded transition-colors font-medium text-brown-700 hover:bg-brown-100 ${currentPath === link.to ? 'bg-brown-200' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
