"use client";

import { useSearchParams } from "next/navigation";
import BookingFlow from "./BookingFlow";
import { travelTypes, type TravelType } from "@/content/site";

export default function BookingEntry() {
  const params = useSearchParams();
  const str = (key: string) => params.get(key) ?? "";
  const travel = travelTypes.includes(str("travel") as TravelType)
    ? (str("travel") as TravelType)
    : "Wohnmobil";
  return (
    <BookingFlow
      key={params.toString()}
      initial={{
        arrival: str("arrival"),
        departure: str("departure"),
        travel,
        adults: Math.min(
          12,
          Math.max(1, Math.floor(Number(str("adults"))) || 2),
        ),
      }}
    />
  );
}
