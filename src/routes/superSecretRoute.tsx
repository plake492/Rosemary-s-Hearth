import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/superSecretRoute')({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentOpeningTimestamp, setCurrentOpeningTimestamp] =
    React.useState<Date | null>(null);
  const [currentCountdown, setCurrentCountdown] = React.useState<Date | null>(
    null,
  );
  const [openInput, setOpenInput] = React.useState<string>('');
  const [closeInput, setCloseInput] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchOrdersStatus = async () => {
      const { data, error } = await supabase
        .from('order-time')
        .select()
        .single();
      if (error) {
        console.error('Error fetching orders status:', error);
      } else {
        if (data.orders_open_timestamp) {
          setCurrentOpeningTimestamp(
            new Date(data.orders_open_timestamp.split('T').join(' ')),
          );
          setOpenInput(data.orders_open_timestamp.slice(0, 16)); // for input type="datetime-local"
        }
        if (data.orders_close_timestamp) {
          setCurrentCountdown(
            new Date(data.orders_close_timestamp.split('T').join(' ')),
          );
          setCloseInput(data.orders_close_timestamp.slice(0, 16));
        }
      }
    };
    fetchOrdersStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Convert to ISO string for DB
    const openISO = openInput ? new Date(openInput).toISOString() : null;
    const closeISO = closeInput ? new Date(closeInput).toISOString() : null;
    const { error } = await supabase
      .from('order-time')
      .update({
        orders_open_timestamp: openISO,
        orders_close_timestamp: closeISO,
      })
      .eq('id', 1); // assuming single row with id 1
    if (error) {
      setMessage('Error updating values.');
    } else {
      setMessage('Timestamps updated!');
      setCurrentOpeningTimestamp(openISO ? new Date(openISO) : null);
      setCurrentCountdown(closeISO ? new Date(closeISO) : null);
    }
    setLoading(false);
  };

  return (
    <div className="bg-cream container mx-auto p-4">
      <h1 className="h1">Admin Dash</h1>
      {currentOpeningTimestamp && (
        <p className="h4">
          Current Opening Timestamp: {currentOpeningTimestamp?.toString()}
        </p>
      )}
      {currentCountdown && (
        <p className="h4">Current Countdown: {currentCountdown.toString()}</p>
      )}
      <form
        className="mt-6 flex flex-col gap-4 max-w-md"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1">
          <span>Orders Open Timestamp</span>
          <input
            type="datetime-local"
            value={openInput}
            onChange={(e) => setOpenInput(e.target.value)}
            className="border rounded p-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Orders Close Timestamp</span>
          <input
            type="datetime-local"
            value={closeInput}
            onChange={(e) => setCloseInput(e.target.value)}
            className="border rounded p-2"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Timestamps'}
        </button>
        {message && <p className="text-green-700">{message}</p>}
      </form>
    </div>
  );
}
