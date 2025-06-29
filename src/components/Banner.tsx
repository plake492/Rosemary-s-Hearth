import React from 'react';
import { supabase } from '@/lib/supabase';

const getTimeRemaining = (target: Date | null): string => {
  if (!target) return '0 days 0 hours 0 minutes 0 seconds';
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return '0 days 0 hours 0 minutes 0 seconds';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
};

export default function Banner() {
  const [openingTimestamp, setOpeningTimestamp] = React.useState<Date | null>(
    null,
  );
  const [countdown, setCountdown] = React.useState<string>('');

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
          setOpeningTimestamp(
            new Date(data.orders_open_timestamp.split('T').join(' ')),
          );
        }
      }
    };
    fetchOrdersStatus();
  }, []);

  React.useEffect(() => {
    if (!openingTimestamp) return;
    const updateCountdown = () => {
      setCountdown(getTimeRemaining(openingTimestamp));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [openingTimestamp]);

  return (
    <nav className="p-4 bg-brown grid place-items-center">
      <p className="h4">
        <span className="secondary-font">Orders Open In:</span>{' '}
        <span>{countdown}</span>
      </p>
    </nav>
  );
}
