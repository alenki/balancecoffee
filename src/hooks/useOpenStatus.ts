import { useEffect, useState } from 'react';
import { cafe } from '../data/cafe';

export interface OpenStatus {
  open: boolean;
  /** Whole hours, local to Nalchik. */
  opensAt: number;
  closesAt: number;
  /** True after closing time, so the next opening is tomorrow. */
  opensTomorrow: boolean;
  /** Ramadan hours apply today. */
  ramadan: boolean;
}

/**
 * Whether today falls in Ramadan, read off the Islamic calendar that every
 * current browser ships in Intl. Umm al-Qura first; the tabular calendar as
 * a fallback. Either can sit a day off local moon sighting, which only moves
 * the switch to Ramadan hours by a day.
 */
function inRamadan(date: Date): boolean {
  for (const calendar of ['islamic-umalqura', 'islamic']) {
    try {
      const month = Number(
        new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
          month: 'numeric',
          timeZone: cafe.timeZone,
        }).format(date)
      );
      if (Number.isFinite(month)) return month === 9;
    } catch {
      // Calendar not supported here: try the next one.
    }
  }
  return false;
}

/** Minutes since midnight on the café's clock, wherever the visitor is. */
function minutesInNalchik(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: cafe.timeZone,
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return value('hour') * 60 + value('minute');
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const ramadan = inRamadan(date);
  const { open: opensAt, close: closesAt } = ramadan ? cafe.ramadanHours : cafe.hours;
  const now = minutesInNalchik(date);
  const open = now >= opensAt * 60 && now < closesAt * 60;
  return { open, opensAt, closesAt, opensTomorrow: now >= closesAt * 60, ramadan };
}

/** Live open/closed state, refreshed every half minute. */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState(getOpenStatus);

  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
