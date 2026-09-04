import { useEffect, useState } from "react";

export function useCurrentDateTime() {
  const [dateTime, setDateTime] = useState(() => formatNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(formatNow());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return dateTime;
}

function formatNow() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const date = `${dd}-${mm}-${yyyy}`;

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const hour = now.getHours();
  const greeting =
    hour < 12
      ? "Good Morning, Admin"
      : hour < 18
        ? "Good Afternoon, Admin"
        : "Good Evening, Admin";

  return {
    date,
    time,
    formatted: `${date} · ${time}`,
    greeting,
  };
}
