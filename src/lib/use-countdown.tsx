import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/settings';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

interface CountdownFormat {
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export default function useCountdown(datetime: string) {
  const [format, setFormat] = useState<CountdownFormat>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = dayjs();
      const distance = dayjs(datetime).diff(now);

      if (distance <= 0) {
        clearInterval(intervalId);
        return;
      }

      const duration = dayjs.duration(distance);
      setFormat({
        day: duration.days(),
        hour: duration.hours(),
        minute: duration.minutes(),
        second: duration.seconds(),
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return format;
}
