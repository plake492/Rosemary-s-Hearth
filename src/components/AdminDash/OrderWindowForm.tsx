import React from 'react';
import { supabase } from '@/lib/supabase';

const DayOptions = () => (
  <>
    <option value="">Select a day</option>
    <option value={0}>Sunday</option>
    <option value={1}>Monday</option>
    <option value={2}>Tuesday</option>
    <option value={3}>Wednesday</option>
    <option value={4}>Thursday</option>
    <option value={5}>Friday</option>
    <option value={6}>Saturday</option>
  </>
);

export default function OrderWindowForm() {
  const [openInput, setOpenInput] = React.useState<string>('');
  const [closeInput, setCloseInput] = React.useState<string>('');
  const [openDay, setOpenDay] = React.useState<number | null>(null);
  const [openTime, setOpenTime] = React.useState<string>('');
  const [closeDay, setCloseDay] = React.useState<number | null>(null);
  const [closeTime, setCloseTime] = React.useState<string>('');
  const [recurringDates, setRecurringDates] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  // Product state

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
          setOpenInput(data.orders_open_timestamp.slice(0, 16));
        }
        if (data.orders_close_timestamp) {
          setCloseInput(data.orders_close_timestamp.slice(0, 16));
        }
        // Use correct columns for open/close day/time and recurring switch
        if (typeof data.orders_open_day === 'number')
          setOpenDay(data.orders_open_day);
        if (typeof data.orders_open_time === 'string')
          setOpenTime(data.orders_open_time);
        if (typeof data.orders_close_day === 'number')
          setCloseDay(data.orders_close_day);
        if (typeof data.orders_close_time === 'string')
          setCloseTime(data.orders_close_time);
        if (typeof data.use_recurring_time === 'boolean')
          setRecurringDates(data.use_recurring_time);
      }
    };
    // const fetchProducts = async () => {
    //   const { data, error } = await supabase.from('product').select();
    //   if (!error && data) setProducts(data);
    // };
    fetchOrdersStatus();
    // fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const openISO = openInput ? new Date(openInput).toISOString() : null;
    const closeISO = closeInput ? new Date(closeInput).toISOString() : null;
    const { error } = await supabase
      .from('order-time')
      .update({
        orders_open_timestamp: openISO,
        orders_close_timestamp: closeISO,
        orders_open_day: openDay,
        orders_open_time: openTime,
        orders_close_day: closeDay,
        orders_close_time: closeTime,
        use_recurring_time: recurringDates,
      })
      .eq('id', 1);
    if (error) {
      setMessage('Error updating values.');
    } else {
      setMessage('Timestamps updated!');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 flex-1">
      <p className="h3 mb-4">Update Time</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div
          className="flex flex-col gap-4 max-w-md"
          style={{ opacity: recurringDates ? 1 : 0.4 }}
        >
          <p className="h4 mb-1 mt-4">Recurring Order Window</p>
          <label className="flex flex-col gap-1">
            <span>Orders Open Day</span>
            <select
              value={openDay ?? ''}
              onChange={(e) =>
                setOpenDay(
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
              className="border rounded p-2"
              required
            >
              {DayOptions()}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span>Orders Open Time</span>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="border rounded p-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Orders Close Day</span>
            <select
              value={closeDay ?? ''}
              onChange={(e) =>
                setCloseDay(
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
              className="border rounded p-2"
              required
            >
              {DayOptions()}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span>Orders Close Time</span>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="border rounded p-2"
              required
            />
          </label>
        </div>

        <div
          className="flex flex-col gap-4 max-w-md"
          style={{ opacity: !recurringDates ? 1 : 0.4 }}
        >
          <p className="h4 mb-1 mt-4">Manual Order Window</p>
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
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none mt-4 mb-4">
          <span
            className={
              `text-md font-semibold ` +
              (!recurringDates ? 'text-brown' : 'text-gray-700')
            }
          >
            Set date and time manually
          </span>
          <span className="relative inline-block w-10 h-6">
            <input
              type="checkbox"
              checked={recurringDates}
              onChange={(e) => setRecurringDates(e.target.checked)}
              className="peer opacity-0 w-10 h-6 absolute left-0 top-0 cursor-pointer"
            />
            <span
              className={
                `block w-10 h-6 rounded-full transition-colors duration-200 ` +
                (recurringDates ? 'bg-brown' : 'bg-gray-300')
              }
            ></span>
            <span
              className={
                `absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ` +
                (recurringDates ? 'translate-x-4' : '')
              }
            ></span>
          </span>
          <span
            className={
              `text-md font-semibold ` +
              (recurringDates ? 'text-brown' : 'text-gray-700')
            }
          >
            Recurring time
          </span>
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
