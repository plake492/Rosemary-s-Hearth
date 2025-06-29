import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function getCurrentOrNextWindow(
  openDay: number,
  openTime: string,
  closeDay: number,
  closeTime: string,
): { openDate: Date; closeDate: Date } {
  const now = new Date();
  const currentDay = now.getDay();
  let openDate = new Date(now);
  let daysSinceOpen = (currentDay - openDay + 7) % 7;
  openDate.setDate(now.getDate() - daysSinceOpen);
  const [openHour, openMinute] = openTime.split(':').map(Number);
  openDate.setHours(openHour, openMinute, 0, 0);
  let closeDate = new Date(openDate);
  let closeDayOffset = (closeDay - openDay + 7) % 7;
  closeDate.setDate(openDate.getDate() + closeDayOffset);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  closeDate.setHours(closeHour, closeMinute, 0, 0);
  if (closeDate <= openDate) closeDate.setDate(closeDate.getDate() + 7);
  if (now > closeDate) {
    openDate.setDate(openDate.getDate() + 7);
    closeDate.setDate(closeDate.getDate() + 7);
  }
  return { openDate, closeDate };
}

function getTimeRemaining(target: Date | null): string {
  if (!target) return '0 days 0 hours 0 minutes';
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return '0 days 0 hours 0 minutes';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

export function useOrderWindowCountdown() {
  const [countdown, setCountdown] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  const [windowCountdown, setWindowCountdown] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(true);

  // For recurring
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openTime, setOpenTime] = useState<string>('');
  const [closeDay, setCloseDay] = useState<number | null>(null);
  const [closeTime, setCloseTime] = useState<string>('');

  // For manual
  const [openingTimestamp, setOpeningTimestamp] = useState<Date | null>(null);
  const [closingTimestamp, setClosingTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const fetchOrdersStatus = async () => {
      const { data, error } = await supabase
        .from('order-time')
        .select()
        .single();
      if (error) {
        setLoading(false);
        return;
      }
      setRecurring(!!data.use_recurring_time);
      if (data.use_recurring_time) {
        setOpenDay(
          typeof data.orders_open_day === 'number'
            ? data.orders_open_day
            : null,
        );
        setOpenTime(data.orders_open_time || '');
        setCloseDay(
          typeof data.orders_close_day === 'number'
            ? data.orders_close_day
            : null,
        );
        setCloseTime(data.orders_close_time || '');
      } else {
        setOpeningTimestamp(
          data.orders_open_timestamp
            ? new Date(data.orders_open_timestamp.split('T').join(' '))
            : null,
        );
        setClosingTimestamp(
          data.orders_close_timestamp
            ? new Date(data.orders_close_timestamp.split('T').join(' '))
            : null,
        );
      }
      setLoading(false);
    };
    fetchOrdersStatus();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (
      recurring &&
      openDay !== null &&
      closeDay !== null &&
      openTime &&
      closeTime
    ) {
      const update = () => {
        let { openDate, closeDate } = getCurrentOrNextWindow(
          openDay as number,
          openTime,
          closeDay as number,
          closeTime,
        );
        const now = new Date();
        if (now < openDate) {
          setCountdown(getTimeRemaining(openDate));
          setShowCTA(false);
          setWindowCountdown('');
        } else if (now >= openDate && now <= closeDate) {
          setCountdown('Open!');
          setShowCTA(true);
          setWindowCountdown(getTimeRemaining(closeDate));
        } else {
          openDate.setDate(openDate.getDate() + 7);
          closeDate.setDate(closeDate.getDate() + 7);
          setCountdown(getTimeRemaining(openDate));
          setShowCTA(false);
          setWindowCountdown('');
        }
      };
      update();
      interval = setInterval(update, 10000);
    } else if (!recurring && openingTimestamp && closingTimestamp) {
      const update = () => {
        const now = new Date();
        if (now < openingTimestamp) {
          setCountdown(getTimeRemaining(openingTimestamp));
          setShowCTA(false);
          setWindowCountdown('');
        } else if (now >= openingTimestamp && now <= closingTimestamp) {
          setCountdown('Open!');
          setShowCTA(true);
          setWindowCountdown(getTimeRemaining(closingTimestamp));
        } else {
          setCountdown(getTimeRemaining(openingTimestamp));
          setShowCTA(false);
          setWindowCountdown('');
        }
      };
      update();
      interval = setInterval(update, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    recurring,
    openDay,
    openTime,
    closeDay,
    closeTime,
    openingTimestamp,
    closingTimestamp,
  ]);

  return {
    countdown,
    showCTA,
    windowCountdown,
    loading,
    recurring,
  };
}
