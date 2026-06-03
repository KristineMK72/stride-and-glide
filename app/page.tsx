import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Stride & Glide</h1>
      <p>Track workouts, food, miles, and momentum.</p>
      <Link href="/fitness">Open Fitness Tracker</Link>
    </main>
  );
}
