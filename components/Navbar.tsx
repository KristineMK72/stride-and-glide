"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "🏠 Home" },
  { href: "/fitness", label: "📊 Fitness" },
  { href: "/track", label: "📍 Track" },
  { href: "/diet", label: "🍎 Diet" },
  { href: "/progress", label: "📈 Progress" },
];

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        🛼 Stride & Glide
      </div>

      <div style={styles.links}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    background: "rgba(2,6,23,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    fontWeight: 900,
    fontSize: 18,
    color: "white",
  },
  links: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    fontSize: 14,
    fontWeight: 700,
  },
};
