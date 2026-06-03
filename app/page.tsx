import Link from "next/link";

const cards = [
  {
    href: "/fitness",
    emoji: "📊",
    title: "Fitness Tracker",
    text: "Log workouts, food, water, miles, and calories.",
  },
  {
    href: "/track",
    emoji: "📍",
    title: "Live GPS Tracking",
    text: "Track distance, speed, route, and GeoJSON.",
  },
  {
    href: "/diet",
    emoji: "🍎",
    title: "Diet Menu",
    text: "Meal ideas, protein goals, and shopping list.",
  },
  {
    href: "/progress",
    emoji: "📈",
    title: "Progress",
    text: "Coming soon: weight, photos, streaks, and charts.",
  },
];

export default function HomePage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Stride & Glide</p>
        <h1 style={styles.title}>Your movement command center.</h1>
        <p style={styles.subtitle}>
          Track workouts, live routes, food, water, protein, and progress.
        </p>

        <div style={styles.grid}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} style={styles.card}>
              <span style={styles.emoji}>{card.emoji}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 22,
    background:
      "radial-gradient(circle at top left, rgba(249,115,22,0.35), transparent 30%), linear-gradient(135deg, #020617, #1e1b4b 55%, #312e81)",
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto",
    paddingTop: 46,
  },
  eyebrow: {
    color: "#fed7aa",
    textTransform: "uppercase",
    letterSpacing: 3,
    fontWeight: 900,
  },
  title: {
    fontSize: "clamp(42px, 10vw, 88px)",
    lineHeight: 0.95,
    margin: "8px 0",
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.85)",
    maxWidth: 720,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 16,
    marginTop: 28,
  },
  card: {
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "white",
    textDecoration: "none",
    boxShadow: "0 22px 70px rgba(0,0,0,0.28)",
  },
  emoji: {
    fontSize: 34,
  },
};
