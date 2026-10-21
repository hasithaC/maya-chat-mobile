import {useEffect, useState} from 'react';

const pad = (value: number) => String(value).padStart(2, '0');

// Formats elapsed call time as HH:MM:SS, ticking every second while
// `connectedAt` is set. Returns null before the call connects.
export function useCallDuration(connectedAt?: number): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!connectedAt) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [connectedAt]);

  if (!connectedAt) return null;

  const totalSeconds = Math.max(0, Math.floor((now - connectedAt) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
