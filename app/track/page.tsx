"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

type Point = {
  lat: number;
  lng: number;
  time: number;
  speedMps: number | null;
};

export default function TrackPage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [tracking, setTracking] = useState(false);
  const [message, setMessage] = useState("");
  const watchId = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);

  const current = points[points.length - 1];

  const distanceMiles = useMemo(() => {
    if (points.length < 2) return 0;

    const line = turf.lineString(points.map((p) => [p.lng, p.lat]));
    return turf.length(line, { units: "miles" });
  }, [points]);

  const elapsedMinutes = useMemo(() => {
    if (!startedAt.current || points.length === 0) return 0;
    return (Date.now() - startedAt.current) / 1000 / 60;
  }, [points]);

  const avgMph = elapsedMinutes > 0 ? distanceMiles / (elapsedMinutes / 60) : 0;

  const liveMph =
    current?.speedMps != null && current.speedMps > 0
      ? current.speedMps * 2.23694
      : avgMph;

  function startTracking() {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("GPS is not available on this device.");
      return;
    }

    setPoints([]);
    setTracking(true);
    startedAt.current = Date.now();

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;

        setPoints((prev) => [
          ...prev,
          {
            lat: latitude,
            lng: longitude,
            time: Date.now(),
            speedMps: speed,
          },
        ]);
      },
      (error) => {
        setMessage(error.message);
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  function stopTracking() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    setTracking(false);
  }

  function downloadGeoJson() {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            app: "Stride & Glide",
            distance_miles: distanceMiles,
            duration_minutes: elapsedMinutes,
            avg_mph: avgMph,
          },
          geometry: {
            type: "LineString",
            coordinates: points.map((p) => [p.lng, p.lat]),
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/geo+json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stride-and-glide-route.geojson";
    link.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const mapCenter: [number, number] = current
    ? [current.lat, current.lng]
    : [46.358, -94.2];

  const line = points.map((p) => [p.lat, p.lng]) as [number, number][];

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.eyebrow}>Live Tracker</p>
        <h1 style={styles.title}>Track your route in real time.</h1>

        {message && <p style={styles.message}>{message}</p>}

        <section style={styles.stats}>
          <Stat label="Miles" value={distanceMiles.toFixed(2)} />
          <Stat label="Minutes" value={elapsedMinutes.toFixed(1)} />
          <Stat label="Avg MPH" value={avgMph.toFixed(1)} />
          <Stat label="Live MPH" value={liveMph.toFixed(1)} />
        </section>

        <div style={styles.buttons}>
          {!tracking ? (
            <button onClick={startTracking} style={styles.start}>
              Start Tracking
            </button>
          ) : (
            <button onClick={stopTracking} style={styles.stop}>
              Stop Tracking
            </button>
          )}

          <button
            onClick={downloadGeoJson}
            disabled={points.length < 2}
            style={styles.secondary}
          >
            Download GeoJSON
          </button>
        </div>

        <div style={styles.mapWrap}>
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {current && <Marker position={[current.lat, current.lng]} />}
            {line.length > 1 && <Polyline positions={line} />}
          </MapContainer>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 18,
    background: "linear-gradient(135deg, #020617, #1e1b4b, #312e81)",
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 20,
    borderRadius: 28,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  eyebrow: {
    color: "#fed7aa",
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(34px, 7vw, 68px)",
    lineHeight: 1,
  },
  message: {
    background: "rgba(255,255,255,0.18)",
    padding: 12,
    borderRadius: 16,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
    margin: "20px 0",
  },
  stat: {
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.14)",
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  start: {
    padding: "14px 18px",
    borderRadius: 999,
    border: "none",
    background: "#22c55e",
    color: "white",
    fontWeight: 900,
  },
  stop: {
    padding: "14px 18px",
    borderRadius: 999,
    border: "none",
    background: "#ef4444",
    color: "white",
    fontWeight: 900,
  },
  secondary: {
    padding: "14px 18px",
    borderRadius: 999,
    border: "none",
    background: "#f97316",
    color: "white",
    fontWeight: 900,
  },
  mapWrap: {
    height: 520,
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};
