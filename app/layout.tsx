import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stride & Glide",
  description: "Track workouts, food, miles, routes, and momentum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
