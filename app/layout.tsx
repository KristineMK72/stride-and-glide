import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stride & Glide",
  description:
    "Track workouts, routes, food, water, calories, and fitness progress.",
  applicationName: "Stride & Glide",
  keywords: [
    "fitness",
    "walking",
    "running",
    "rollerblading",
    "cycling",
    "gps tracking",
    "route tracker",
    "diet tracker",
    "workout tracker",
  ],
  authors: [
    {
      name: "Kristine Kahler",
    },
  ],
  openGraph: {
    title: "Stride & Glide",
    description:
      "Track workouts, routes, nutrition, miles, speed, and momentum.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#312e81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
