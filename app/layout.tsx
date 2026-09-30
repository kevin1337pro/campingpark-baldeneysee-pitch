import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: "Campingpark Baldeneysee · Weniger Alltag. Mehr See.",
  description:
    "Ein Website-Konzept von Phinix.Media. Camping am Baldeneysee entdecken und eine unverbindliche Anfrage als Demo erleben.",
  robots: { index: false, follow: false, noarchive: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <a className="skip" href="#main">
          Zum Inhalt
        </a>
        {children}
      </body>
    </html>
  );
}
