"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { localToday, calendarDay } from "@/lib/booking/model";
export default function Calendar({
  arrival,
  departure,
  onChange,
}: {
  arrival: string;
  departure: string;
  onChange: (a: string, d: string) => void;
}) {
  const today = localToday();
  const [month, setMonth] = useState(() => {
    const d = new Date(
      (Number.isFinite(calendarDay(arrival)) ? arrival : today) + "T12:00:00",
    );
    return new Date(d.getFullYear(), d.getMonth(), 1, 12);
  });
  const monthStr = new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
  }).format(month);
  const start = (month.getDay() + 6) % 7;
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const first = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const selectingDeparture = !!arrival && !departure;
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          aria-label="Vorheriger Monat"
          disabled={first <= today.slice(0, 7)}
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))
          }
        >
          <ChevronLeft size={19} />
        </button>
        <strong aria-live="polite">{monthStr}</strong>
        <button
          type="button"
          aria-label="Nächster Monat"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))
          }
        >
          <ChevronRight size={19} />
        </button>
      </div>
      <div className="calendar-grid">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <span key={day} className="weekday">
            {day}
          </span>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <span key={"empty" + i} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = `${first}-${String(i + 1).padStart(2, "0")}`;
          const selected = date === arrival || date === departure;
          return (
            <button
              type="button"
              key={date}
              aria-label={`${i + 1}. ${monthStr}${date === arrival ? ", Anreise" : date === departure ? ", Abreise" : ""}`}
              aria-pressed={selected}
              disabled={date < today}
              className={`${selected ? "selected" : ""} ${date > arrival && date < departure ? "in-range" : ""} ${date === today ? "today" : ""}`}
              onClick={() => {
                if (selectingDeparture) {
                  onChange(arrival, date);
                } else onChange(date, "");
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="calendar-hint" aria-live="polite">
        {selectingDeparture
          ? "Wähle jetzt deine Abreise."
          : "Wähle deine Anreise oder ändere die Datumsfelder."}
      </p>
    </div>
  );
}
