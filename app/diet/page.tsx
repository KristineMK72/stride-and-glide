const meals = [
  {
    title: "Breakfast",
    options: [
      "Greek yogurt + berries + granola",
      "Eggs + spinach + toast",
      "Protein smoothie with banana",
      "Oatmeal + peanut butter + protein",
    ],
  },
  {
    title: "Lunch",
    options: [
      "Chicken rice bowl",
      "Turkey wrap + veggies",
      "Tuna salad + crackers",
      "Cottage cheese bowl + fruit",
    ],
  },
  {
    title: "Dinner",
    options: [
      "Salmon + sweet potato + broccoli",
      "Turkey burger bowl",
      "Chicken tacos on corn tortillas",
      "Stir fry with rice and veggies",
    ],
  },
  {
    title: "Snacks",
    options: [
      "String cheese",
      "Hard-boiled eggs",
      "Apple + peanut butter",
      "Protein shake",
      "Cottage cheese",
    ],
  },
];

const shopping = [
  "Greek yogurt",
  "Eggs",
  "Chicken breast",
  "Ground turkey",
  "Salmon or tuna",
  "Cottage cheese",
  "Protein powder",
  "Bananas",
  "Berries",
  "Apples",
  "Spinach",
  "Broccoli",
  "Asparagus",
  "Sweet potatoes",
  "Brown rice",
  "Oatmeal",
  "Corn tortillas",
  "Peanut butter",
  "String cheese",
  "Unsweetened tea",
];

export default function DietPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Diet Plan</p>
        <h1 style={styles.title}>Eat for energy, protein, and fat loss.</h1>
        <p style={styles.subtitle}>
          Simple meals for walking, running, rollerblading, and staying full.
        </p>
      </section>

      <section style={styles.grid}>
        {meals.map((meal) => (
          <div key={meal.title} style={styles.card}>
            <h2>{meal.title}</h2>
            <ul>
              {meal.options.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section style={styles.cardWide}>
        <h2>Shopping List</h2>
        <div style={styles.shoppingGrid}>
          {shopping.map((item) => (
            <label key={item} style={styles.checkItem}>
              <input type="checkbox" /> {item}
            </label>
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
      "radial-gradient(circle at top left, rgba(34,197,94,0.3), transparent 30%), linear-gradient(135deg, #020617, #1e1b4b 55%, #312e81)",
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 22px",
  },
  eyebrow: {
    color: "#bbf7d0",
    textTransform: "uppercase",
    letterSpacing: 3,
    fontWeight: 900,
  },
  title: {
    fontSize: "clamp(40px, 9vw, 82px)",
    lineHeight: 0.95,
    margin: "8px 0",
  },
  subtitle: {
    fontSize: 19,
    color: "rgba(255,255,255,0.85)",
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
  },
  cardWide: {
    maxWidth: 1100,
    margin: "18px auto 0",
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
  },
  shoppingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
  },
  checkItem: {
    padding: 12,
    borderRadius: 14,
    background: "#f1f5f9",
    fontWeight: 700,
  },
};
