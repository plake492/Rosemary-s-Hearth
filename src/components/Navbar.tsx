import React from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

const convertToDate = (timestamp: string | null): string | null => {
  if (!timestamp) return null;
  const date = new Date(timestamp.split('T').join(' '));
  return isNaN(date.getTime()) ? null : format(date, 'MMMM do, yyyy h:mm a');
};

export default function Navbar() {
  const [ordersOpen, setOrdersOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrdersStatus = async () => {
      const { data, error } = await supabase
        .from('order-time')
        .select()
        .single();
      console.log('data ==>', data);

      if (error) {
        console.error('Error fetching orders status:', error);
      } else {
        setOrdersOpen(convertToDate(data.orders_open_timestamp));
      }
    };

    fetchOrdersStatus();
  }, []);

  return (
    <nav className="rounded-lg bg-orange p-4 bg-ornage">
      <h4>
        <span className="font-alt">Orders Open In:</span>{' '}
        <strong>{ordersOpen}</strong>
      </h4>
    </nav>
  );
}
