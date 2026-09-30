"use client";
import { CalendarDays, Tent, Users } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { localToday } from "@/lib/booking/model";
const subscribeToDate = (callback: () => void) => {
  window.addEventListener("focus", callback);
  const timer = window.setInterval(callback, 60000);
  return () => {
    window.removeEventListener("focus", callback);
    window.clearInterval(timer);
  };
};
export default function HeroSearch() {
  const today = useSyncExternalStore(subscribeToDate, localToday, () => "");
  const router = useRouter();
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [travel, setTravel] = useState("Wohnmobil");
  const [adults, setAdults] = useState("2");
  return (
    <form
      className="hero-search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(
          "/anfragen?" +
            new URLSearchParams({ arrival, departure, travel, adults }),
        );
      }}
    >
      <div className="search-intro">
        <span className="eyebrow">DEIN PLATZ FÜR EINE AUSZEIT</span>
        <span>Wann zieht es dich raus?</span>
      </div>
      <div className="search-fields">
        <label>
          <span>
            <CalendarDays size={17} /> Anreise
          </span>
          <input
            aria-label="Anreise im Anfrage-Einstieg"
            type="date"
            min={today}
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </label>
        <label>
          <span>
            <CalendarDays size={17} /> Abreise
          </span>
          <input
            aria-label="Abreise im Anfrage-Einstieg"
            type="date"
            min={arrival || today}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
        </label>
        <label>
          <span>
            <Tent size={17} /> Unterwegs mit
          </span>
          <select value={travel} onChange={(e) => setTravel(e.target.value)}>
            <option>Wohnmobil</option>
            <option>Wohnwagen</option>
            <option>Zelt</option>
          </select>
        </label>
        <label>
          <span>
            <Users size={17} /> Erwachsene
          </span>
          <select value={adults} onChange={(e) => setAdults(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i === 0 ? "Erwachsener" : "Erwachsene"}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          Aufenthalt anfragen
        </button>
      </div>
      <p className="search-note">
        Unverbindlich planen · Demo ohne Versand · Kategorien zur
        Veranschaulichung
      </p>
    </form>
  );
}
