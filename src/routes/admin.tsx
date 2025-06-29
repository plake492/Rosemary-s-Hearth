import React from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate({ to: '/admin-dash' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="h2 text-center">Admin Login</h1>
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
