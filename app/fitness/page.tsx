"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Workout = {
  id: string;
  activity_type: string;
  distance_miles: number;
  duration_minutes: number;
  avg_mph: number;
  calories: number;
  route_name: string | null;
  notes: string | null;
  workout_date: string;
};

type DietLog = {
  id: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_oz: number;
  log_date: string;
};

const today = new Date().toISOString().slice(0, 10);

export default function FitnessPage() {
  const supabase = createSupabaseBrowserClient();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [workoutForm, setWorkoutForm] = useState({
    activity_type: "rollerblading",
    distance_miles: "",
    duration_minutes: "",
    calories: "",
    route_name: "",
    notes: "",
    workout_date: today,
  });

  const [dietForm, setDietForm] = useState({
    meal_type: "breakfast",
    food_name: "",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fat_g: "",
    water_oz: "",
    log_date: today,
  });

  async function loadData() {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("Log in with Supabase Auth to save workouts and food logs.");
      setLoading(false);
      return;
    }

    const [{ data: workoutData, error: workoutError }, { data: dietData, error: dietError }] =
      await Promise.all([
        supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .order("workout_date", { ascending: false }),

        supabase
          .from("diet_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("log_date", { ascending: false }),
      ]);

    if (workoutError || dietError) {
      setMessage(workoutError?.message || dietError?.message || "Something went wrong.");
    }

    setWorkouts((workoutData || []) as Workout[]);
    setDietLogs((dietData || []) as DietLog[]);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalMiles = workouts.reduce(
      (sum, w) => sum + Number(w.distance_miles || 0),
      0
    );

    const totalMinutes = workouts.reduce(
      (sum, w) => sum + Number(w.duration_minutes || 0),
      0
    );

    const totalBurned = workouts.reduce(
      (sum, w) => sum + Number(w.calories || 0),
      0
    );

    const totalEaten = dietLogs.reduce(
      (sum, d) => sum + Number(d.calories || 0),
      0
    );

    const totalProtein = dietLogs.reduce(
      (sum, d) => sum + Number(d.protein_g || 0),
      0
    );

    const totalWater = dietLogs.reduce(
      (sum, d) => sum + Number(d.water_oz || 0),
      0
    );

    return {
      totalMiles,
      totalMinutes,
      totalBurned,
      totalEaten,
      totalProtein,
      totalWater,
      avgMph: totalMinutes > 0 ? totalMiles / (totalMinutes / 60) : 0,
      netCalories: totalEaten - totalBurned,
    };
  }, [workouts, dietLogs]);

  async function addWorkout(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("workouts").insert({
      user_id: user.id,
      activity_type: workoutForm.activity_type,
      distance_miles: Number(workoutForm.distance_miles || 0),
      duration_minutes: Number(workoutForm.duration_minutes || 0),
      calories: Number(workoutForm.calories || 0),
      route_name: workoutForm.route_name || null,
      notes: workoutForm.notes || null,
      workout_date: workoutForm.workout_date,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setWorkoutForm({
      activity_type: "rollerblading",
      distance_miles: "",
      duration_minutes: "",
      calories: "",
      route_name: "",
      notes: "",
      workout_date: today,
    });

    await loadData();
  }

  async function addDietLog(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("diet_logs").insert({
      user_id: user.id,
      meal_type: dietForm.meal_type,
      food_name: dietForm.food_name || "Water",
      calories: Number(dietForm.calories || 0),
      protein_g: Number(dietForm.protein_g || 0),
      carbs_g: Number(dietForm.carbs_g || 0),
      fat_g: Number(dietForm.fat_g || 0),
      water_oz: Number(dietForm.water_oz || 0),
      log_date: dietForm.log_date,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setDietForm({
      meal_type: "breakfast",
      food_name: "",
      calories: "",
      protein_g: "",
      carbs_g: "",
      fat_g: "",
      water_oz: "",
      log_date: today,
    });

    await loadData();
  }

  async function deleteWorkout(id: string) {
    await supabase.from("workouts").delete().eq("id", id);
    await loadData();
  }

  async function deleteDietLog(id: string) {
    await supabase.from("diet_logs").delete().eq("id", id);
    await loadData();
  }

  function downloadCsv() {
    const rows = [
      ...workouts.map((w) => ({
        type: "workout",
        date: w.workout_date,
        activity: w.activity_type,
        distance_miles: w.distance_miles,
        duration_minutes: w.duration_minutes,
        avg_mph: w.avg_mph,
        calories: w.calories,
        route_name: w.route_name,
        notes: w.notes,
      })),
      ...dietLogs.map((d) => ({
        type: "diet",
        date: d.log_date,
        meal: d.meal_type,
        food_name: d.food_name,
        calories: d.calories,
        protein_g: d.protein_g,
        carbs_g: d.carbs_g,
        fat_g: d.fat_g,
        water_oz: d.water_oz,
      })),
    ];

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `stride-and-glide-data-${today}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Stride & Glide</p>
        <h1 style={styles.title}>Your movement dashboard</h1>
        <p style={styles.subtitle}>
          Track walking, running, rollerblading, cycling, food, water, miles,
          calories, protein, and momentum.
        </p>

        {message && <div style={styles.message}>{message}</div>}

        <button onClick={downloadCsv} style={styles.exportButton}>
          Download CSV
        </button>
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Miles" value={stats.totalMiles.toFixed(2)} />
        <Stat label="Minutes" value={stats.totalMinutes.toFixed(0)} />
        <Stat label="Avg MPH" value={stats.avgMph.toFixed(1)} />
        <Stat label="Burned" value={`${stats.totalBurned.toFixed(0)} cal`} />
        <Stat label="Eaten" value={`${stats.totalEaten.toFixed(0)} cal`} />
        <Stat label="Net" value={`${stats.netCalories.toFixed(0)} cal`} />
        <Stat label="Protein" value={`${stats.totalProtein.toFixed(0)}g`} />
        <Stat label="Water" value={`${stats.totalWater.toFixed(0)} oz`} />
      </section>

      <section style={styles.twoCol}>
        <form onSubmit={addWorkout} style={styles.card}>
          <h2>Add Workout</h2>

          <label style={styles.label}>Activity</label>
          <select
            value={workoutForm.activity_type}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, activity_type: e.target.value })
            }
            style={styles.input}
          >
            <option value="walking">Walking</option>
            <option value="running">Running</option>
            <option value="rollerblading">Rollerblading</option>
            <option value="cycling">Cycling</option>
            <option value="hiking">Hiking</option>
          </select>

          <label style={styles.label}>Distance miles</label>
          <input
            value={workoutForm.distance_miles}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, distance_miles: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
            placeholder="3.2"
          />

          <label style={styles.label}>Duration minutes</label>
          <input
            value={workoutForm.duration_minutes}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, duration_minutes: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
            placeholder="45"
          />

          <label style={styles.label}>Calories burned</label>
          <input
            value={workoutForm.calories}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, calories: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
            placeholder="320"
          />

          <label style={styles.label}>Route name</label>
          <input
            value={workoutForm.route_name}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, route_name: e.target.value })
            }
            style={styles.input}
            placeholder="Paul Bunyan Trail"
          />

          <label style={styles.label}>Date</label>
          <input
            type="date"
            value={workoutForm.workout_date}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, workout_date: e.target.value })
            }
            style={styles.input}
          />

          <label style={styles.label}>Notes</label>
          <textarea
            value={workoutForm.notes}
            onChange={(e) =>
              setWorkoutForm({ ...workoutForm, notes: e.target.value })
            }
            style={styles.textarea}
            placeholder="Smooth pavement, windy, felt strong..."
          />

          <button style={styles.button}>Save Workout</button>
        </form>

        <form onSubmit={addDietLog} style={styles.card}>
          <h2>Add Food / Water</h2>

          <label style={styles.label}>Meal</label>
          <select
            value={dietForm.meal_type}
            onChange={(e) =>
              setDietForm({ ...dietForm, meal_type: e.target.value })
            }
            style={styles.input}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
            <option value="water">Water</option>
          </select>

          <label style={styles.label}>Food / Drink</label>
          <input
            value={dietForm.food_name}
            onChange={(e) =>
              setDietForm({ ...dietForm, food_name: e.target.value })
            }
            style={styles.input}
            placeholder="Greek yogurt, banana, water..."
          />

          <label style={styles.label}>Calories</label>
          <input
            value={dietForm.calories}
            onChange={(e) =>
              setDietForm({ ...dietForm, calories: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
          />

          <label style={styles.label}>Protein g</label>
          <input
            value={dietForm.protein_g}
            onChange={(e) =>
              setDietForm({ ...dietForm, protein_g: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
          />

          <label style={styles.label}>Carbs g</label>
          <input
            value={dietForm.carbs_g}
            onChange={(e) =>
              setDietForm({ ...dietForm, carbs_g: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
          />

          <label style={styles.label}>Fat g</label>
          <input
            value={dietForm.fat_g}
            onChange={(e) =>
              setDietForm({ ...dietForm, fat_g: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
          />

          <label style={styles.label}>Water oz</label>
          <input
            value={dietForm.water_oz}
            onChange={(e) =>
              setDietForm({ ...dietForm, water_oz: e.target.value })
            }
            style={styles.input}
            inputMode="decimal"
            placeholder="16"
          />

          <label style={styles.label}>Date</label>
          <input
            type="date"
            value={dietForm.log_date}
            onChange={(e) =>
              setDietForm({ ...dietForm, log_date: e.target.value })
            }
            style={styles.input}
          />

          <button style={styles.button}>Save Food / Water</button>
        </form>
      </section>

      <section style={styles.twoCol}>
        <div style={styles.card}>
          <h2>Workout History</h2>

          {loading ? (
            <p>Loading...</p>
          ) : workouts.length === 0 ? (
            <p>No workouts yet. Add your first one today.</p>
          ) : (
            workouts.map((w) => (
              <div key={w.id} style={styles.row}>
                <div>
                  <strong style={styles.capitalize}>{w.activity_type}</strong>
                  <p style={styles.rowText}>
                    {Number(w.distance_miles || 0).toFixed(2)} mi •{" "}
                    {Number(w.duration_minutes || 0).toFixed(0)} min •{" "}
                    {Number(w.avg_mph || 0).toFixed(1)} mph •{" "}
                    {Number(w.calories || 0).toFixed(0)} cal
                  </p>
                  {w.route_name && <small>{w.route_name}</small>}
                  <br />
                  <small>{w.workout_date}</small>
                </div>

                <button
                  type="button"
                  onClick={() => deleteWorkout(w.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.card}>
          <h2>Diet History</h2>

          {loading ? (
            <p>Loading...</p>
          ) : dietLogs.length === 0 ? (
            <p>No food or water logged yet.</p>
          ) : (
            dietLogs.map((d) => (
              <div key={d.id} style={styles.row}>
                <div>
                  <strong>{d.food_name}</strong>
                  <p style={styles.rowText}>
                    {Number(d.calories || 0).toFixed(0)} cal •{" "}
                    {Number(d.protein_g || 0).toFixed(0)}g protein •{" "}
                    {Number(d.carbs_g || 0).toFixed(0)}g carbs •{" "}
                    {Number(d.fat_g || 0).toFixed(0)}g fat •{" "}
                    {Number(d.water_oz || 0).toFixed(0)} oz water
                  </p>
                  <small>
                    {d.meal_type} • {d.log_date}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() => deleteDietLog(d.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.stat}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 24,
    background:
      "radial-gradient(circle at top left, rgba(249,115,22,0.45), transparent 28%), linear-gradient(135deg, #020617, #1e1b4b 55%, #312e81)",
    color: "white",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 24px",
    padding: 26,
    borderRadius: 32,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.28)",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 3,
    fontWeight: 900,
    color: "#fed7aa",
    margin: 0,
  },
  title: {
    fontSize: "clamp(38px, 7vw, 78px)",
    lineHeight: 0.95,
    margin: "10px 0",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.86)",
    maxWidth: 780,
    lineHeight: 1.6,
  },
  message: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  exportButton: {
    marginTop: 18,
    padding: "13px 18px",
    borderRadius: 999,
    border: "none",
    background: "#f97316",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },
  statsGrid: {
    maxWidth: 1100,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 12,
  },
  stat: {
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
  },
  twoCol: {
    maxWidth: 1100,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 18,
  },
  card: {
    padding: 20,
    borderRadius: 28,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    boxShadow: "0 22px 70px rgba(0,0,0,0.25)",
  },
  label: {
    display: "block",
    fontWeight: 800,
    marginTop: 10,
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "6px 0 10px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    background: "white",
    color: "#111827",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: "12px 14px",
    margin: "6px 0 14px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    background: "white",
    color: "#111827",
  },
  button: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 999,
    border: "none",
    background: "#4f46e5",
    color: "white",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  rowText: {
    margin: "4px 0",
    color: "#475569",
  },
  deleteButton: {
    border: "none",
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },
  capitalize: {
    textTransform: "capitalize",
  },
};
