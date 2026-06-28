"use client";

import { useEffect, useState } from "react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

export function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="text-left" dir="rtl">
      <p className="text-3xl font-black leading-none tracking-tight text-white xl:text-5xl">
        {formatTime(now)}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-300 xl:text-base">
        {formatDate(now)}
      </p>
    </div>
  );
}
