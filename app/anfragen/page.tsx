import Header from "@/components/site/Header";
import BookingEntry from "@/components/booking/BookingEntry";
import { Suspense } from "react";
export const metadata = {
  title: "Deine Auszeit planen · Campingpark Baldeneysee",
};
export default function RequestPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Suspense
          fallback={
            <div className="booking-page" role="status">
              Deine Reiseplanung wird geladen …
            </div>
          }
        >
          <BookingEntry />
        </Suspense>
      </main>
    </>
  );
}
