const meals = [
  {
    title: "Breakfast",
    options: [
      "Eggs + bacon + avocado",
      "Full-fat Greek yogurt + raspberries + walnuts",
      "Sausage links + spinach scramble",
      "Coffee with heavy cream + eggs",
    ],
  },
  {
    title: "Lunch",
    options: [
      "Chicken lettuce wraps",
      "Turkey + salami roll-ups with cheese",
      "Ground beef taco bowl over lettuce",
      "Chicken thighs + cucumber salad",
    ],
  },
  {
    title: "Dinner",
    options: [
      "Salmon + asparagus + butter",
      "Ribeye steak + mushrooms",
      "Pork chops + cauliflower mash",
      "White fish or shrimp + zucchini",
    ],
  },
  {
    title: "Snacks",
    options: [
      "Cheddar cheese",
      "Green olives",
      "Walnuts",
      "Avocado with salt + pepper",
      "Turkey slices",
    ],
  },
];

const grocerySections = [
  {
    title: "Fats, Oils & Dairy",
    emoji: "🧈",
    items: [
      "Butter",
      "Coconut oil",
      "Olive oil",
      "Heavy cream",
      "Full-fat plain Greek yogurt",
      "Cheddar cheese",
      "Sour cream",
    ],
  },
  {
    title: "Proteins & Eggs",
    emoji: "🥩",
    items: [
      "Eggs — grab an extra carton",
      "Bacon",
      "Sausage links",
      "Chicken breast",
      "Chicken thighs, skin-on",
      "Ground beef or turkey",
      "Ribeye steak or preferred fatty cut of beef",
      "Pork chops",
      "Salmon",
      "White fish or shrimp",
      "Salami",
      "Turkey slices",
    ],
  },
  {
    title: "Produce",
    emoji: "🥑",
    items: [
      "Avocados",
      "Spinach",
      "Lettuce",
      "Broccoli",
      "Cauliflower",
      "Zucchini",
      "Cucumber",
      "Asparagus",
      "Mushrooms",
      "Raspberries",
      "Garlic",
    ],
  },
  {
    title: "Pantry & Extras",
    emoji: "🫒",
    items: [
      "Walnuts",
      "Green olives",
      "Salsa — no added sugar",
      "Black pepper",
      "Taco seasoning — check for hidden starches",
    ],
  },
];

export default function DietPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Diet Plan</p>
        <h1 style={styles.title}>Keto-friendly fuel for movement.</h1>
        <p style={styles.subtitle}>
          Simple meals and a structured shopping list for high-protein,
          lower-carb eating while you walk, run, skate, bike, and build
          momentum.
        </p>
      </section>

      <section style={styles.notice}>
        <h2>Daily Focus</h2>
        <p>
          Prioritize protein, water, low-carb vegetables, and healthy fats.
          Before harder workouts, keep fuel simple and listen to your energy.
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
        <p style={styles.sectionEyebrow}>Shopping List</p>
        <h2>Keto Grocery List</h2>
        <p style={styles.muted}>
          Organized by section so it is easy to grab what you need at the store.
        </p>

        <div style={styles.groceryGrid}>
          {grocerySections.map((section) => (
            <div key={section.title} style={styles.grocerySection}>
              <h3>
                <span>{section.emoji}</span> {section.title}
              </h3>

              <div style={styles.shoppingGrid}>
                {section.items.map((item) => (
                  <label key={item} style={styles.checkItem}>
                    <input type="checkbox" /> {item}
                  </label>
                ))}
              </div>
            </div>
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
    paddingTop: 22,
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
    lineHeight: 1.5,
    maxWidth: 820,
  },
  notice: {
    maxWidth: 1100,
    margin: "0 auto 18px",
    padding: 20,
    borderRadius: 24,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
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
    boxShadow: "0 18px 55px rgba(0,0,0,0.24)",
  },
  cardWide: {
    maxWidth: 1100,
    margin: "18px auto 0",
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    boxShadow: "0 18px 55px rgba(0,0,0,0.24)",
  },
  sectionEyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#16a34a",
    fontWeight: 900,
    margin: 0,
  },
  muted: {
    color: "#64748b",
    lineHeight: 1.5,
  },
  groceryGrid: {
    display: "grid",
    gap: 18,
    marginTop: 18,
  },
  grocerySection: {
    padding: 16,
    borderRadius: 20,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  shoppingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    background: "#eef2ff",
    fontWeight: 700,
  },
};
