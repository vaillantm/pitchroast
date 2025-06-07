import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import querystring from "querystring";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Setup file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase config
const SUPABASE_URL = "https://ekwlberslednlfxhnytq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrd2xiZXJzbGVkbmxmeGhueXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzAwMzksImV4cCI6MjA2NDQ0NjAzOX0.TaBGlA2c-2CFqpOLyS-yIRrIN56Pcb07ow2Dz-_1yL8";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load roast data once on startup
const roastData = JSON.parse(fs.readFileSync(path.join(__dirname, "rate.json"), "utf-8"));
const keyword_roasts = roastData.keyword_roasts;
const fallback_roasts = roastData.fallback_roasts;

// Session variable
let currentSessionUser = null;

// Roast matching logic
function findRoast(pitch) {
  const pitchLower = pitch.toLowerCase();
  for (const item of keyword_roasts) {
    if (pitchLower.includes(item.keyword.toLowerCase())) {
      return { roast: item.roast, rating: item.rating, keyword: item.keyword };
    }
  }
  const fallback = fallback_roasts[Math.floor(Math.random() * fallback_roasts.length)];
  return { roast: fallback.roast, rating: fallback.rating, keyword: "fallback" };
}

// Free TTS voice URL
function freeTtsUrl(text, voice) {
  const qs = querystring.stringify({ voice, text });
  return `https://api.streamelements.com/kappa/v2/speech?${qs}`;
}

// Helper: get user stats
async function getUserStat(username) {
  const { data, error } = await supabase
    .from("pitch_roasts")
    .select("*")
    .eq("user_name", username);

  if (error) return { error: true };

  const count = data.length;
  const avg_rating = count
    ? data.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;

  return { username, count, avg_rating: parseFloat(avg_rating.toFixed(2)) };
}

// --- ROUTES ---

// Login
app.post("/login", (req, res) => {
  currentSessionUser = req.body.username;
  res.json({ success: true });
});

// Logout
app.post("/logout", (req, res) => {
  currentSessionUser = null;
  res.json({ success: true });
});

// Roast endpoint
app.post("/roast", async (req, res) => {
  const { pitch, user_name = "Anonymous", voice = "Brian" } = req.body;
  if (!pitch || !pitch.trim()) {
    return res.status(400).json({ error: "Pitch is required." });
  }

  const { roast, rating, keyword } = findRoast(pitch);
  const user = currentSessionUser || user_name || "Anonymous";

  const { error } = await supabase.from("pitch_roasts").insert([
    {
      idea: pitch,
      roast,
      rating,
      user_name: user,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) return res.status(500).json({ error: "Database insert failed." });

  res.json({
    roast,
    rating,
    keyword,
    audio_url: freeTtsUrl(roast, voice),
  });
});

// Recent roasts
app.get("/recent", async (req, res) => {
  const { data, error } = await supabase
    .from("pitch_roasts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error: "Failed to fetch recent roasts." });
  res.json(data);
});

// Leaderboard
app.get("/leaderboard", async (req, res) => {
  const [bestRes, worstRes] = await Promise.all([
    supabase.from("pitch_roasts").select("*").order("rating", { ascending: false }).limit(10),
    supabase.from("pitch_roasts").select("*").order("rating", { ascending: true }).limit(10),
  ]);

  if (bestRes.error || worstRes.error) {
    return res.status(500).json({ error: "Failed to fetch leaderboard." });
  }

  res.json({
    best: bestRes.data,
    worst: worstRes.data,
  });
});

// User stats
app.get("/user-stats", async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: "username required" });

  const stats = await getUserStat(username);
  if (stats.error) return res.status(500).json({ error: "Could not retrieve stats" });

  res.json(stats);
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
