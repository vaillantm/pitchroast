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


const roastData = {
  
  "keyword_roasts": [
    { "keyword": "Uber", "roast": "Uber? More like 'overpriced taxi with attitude.'", "rating": 9 },
    { "keyword": "AI", "roast": "AI: Artificial Ignorance, clearly.", "rating": 6 },
    { "keyword": "Voice", "roast": "Voice assistants? More like 'voice irritants.'", "rating": 22 },
    { "keyword": "Dog", "roast": "Dog? More like 'barking up the wrong tree.'", "rating": 31 },
    { "keyword": "Chat", "roast": "Your chat is as lively as a dead battery.", "rating": 9 },
    { "keyword": "Blockchain", "roast": "Blockchain? More like 'block the fun.'", "rating": 11 },
    { "keyword": "Cloud", "roast": "Cloud computing? More like 'fog of disappointment.'", "rating": 2 },
    { "keyword": "Crypto", "roast": "Crypto? More like 'crippling your finances.'", "rating": 9 },
    { "keyword": "Fintech", "roast": "Fintech or just fancy finance nonsense?", "rating": 3 },
    { "keyword": "SaaS", "roast": "SaaS sounds like a bad acronym for laziness.", "rating": 17 },
    { "keyword": "Food", "roast": "Food startup? Hope you serve more than stale ideas.", "rating": 6 },
    { "keyword": "Fitness", "roast": "Fitness startup? Your gains are in bugs, not muscle.", "rating": 13 },
    { "keyword": "Tutor", "roast": "Tutor? Your lessons must be on how to fail.", "rating": 0 },
    { "keyword": "Farm", "roast": "Farming innovation? More like crop of errors.", "rating": 8 },
    { "keyword": "Drone", "roast": "Drone startup? Sounds like a flying paperweight.", "rating": 10 },
    { "keyword": "Ride", "roast": "Ride-sharing? More like ride to nowhere.", "rating": 1 },
    { "keyword": "Sleep", "roast": "Sleep tech? Hope your product isn't a nightmare.", "rating": 5 },
    { "keyword": "Pet", "roast": "Pet startup? Even your ideas need a walk.", "rating": 7 },
    { "keyword": "Eco", "roast": "Eco-friendly? Your green is just envy.", "rating": 4 },
    { "keyword": "Loan", "roast": "Loan startup? Prepare for a bankruptcy lesson.", "rating": 28 },
    { "keyword": "Bike", "roast": "Bike startup? Spinning wheels, going nowhere.", "rating": 8 },
    { "keyword": "Car", "roast": "Car tech? You drive investors away.", "rating": 6 },
    { "keyword": "Home", "roast": "Home startup? More like house of cards.", "rating": 5 },
    { "keyword": "Data", "roast": "Data startup? Data error: idea not found.", "rating": 16 },
    { "keyword": "Social", "roast": "Social app? Socially awkward, more like.", "rating": 20 },
    { "keyword": "Green", "roast": "Green startup? Your idea's more toxic than helpful.", "rating": 5 },
    { "keyword": "Health", "roast": "Health tech? Your app gives headaches.", "rating": 7 },
    { "keyword": "Chatbot", "roast": "Chatbot? More like chat-boring bot.", "rating": 7 },
    { "keyword": "App", "roast": "App? Another useless icon on my phone.", "rating": 7 },
    { "keyword": "Delivery", "roast": "Delivery? Delivering disappointment on time.", "rating": 8 },
    { "keyword": "Market", "roast": "Market startup? Just a flea market of ideas.", "rating": 8 },
    { "keyword": "Travel", "roast": "Travel tech? Your business plan took a detour.", "rating": 4 },
    { "keyword": "Bot", "roast": "Bot startup? Your bots are broken beyond repair.", "rating": 1 },
    { "keyword": "Book", "roast": "Book startup? Reading between your lines is painful.", "rating": 13 },
    { "keyword": "Photo", "roast": "Photo app? Your pics are as blurry as your vision.", "rating": 1 },
    { "keyword": "Video", "roast": "Video startup? Buffering your failures endlessly.", "rating": 9 },
    { "keyword": "Game", "roast": "Game startup? More like a game of chance, and you lose.", "rating": 2 },
    { "keyword": "Learn", "roast": "Learn startup? Your lessons are lessons in failure.", "rating": 0 },
    { "keyword": "Music", "roast": "Music app? Sounds like static noise to me.", "rating": 9 },
    { "keyword": "Shop", "roast": "Shop startup? Your shelves are empty.", "rating": 9 },
    { "keyword": "Smart", "roast": "Smart tech? Your smarts must be artificial too.", "rating": 3 },
    { "keyword": "Pay", "roast": "Payment startup? You owe your users an apology.", "rating": 15 },
    { "keyword": "Taxi", "roast": "Taxi app? You just rerouted to disaster.", "rating": 5 },
    { "keyword": "Wear", "roast": "Wearable tech? You just accessorize your errors.", "rating": 9 },
    { "keyword": "Money", "roast": "Money startup? Your profits are imaginary.", "rating": 11 },
    { "keyword": "Finance", "roast": "Finance app? Your balance sheets don't add up.", "rating": 8 },
    { "keyword": "MedTech", "roast": "MedTech? Your cure is a virus.", "rating": 20 },
    { "keyword": "Insure", "roast": "Insurance startup? You can’t even insure your ideas.", "rating": 26 },
    { "keyword": "Legal", "roast": "Legal startup? Your arguments don’t hold up.", "rating": 14 },
    { "keyword": "Robot", "roast": "Robot startup? Your bots can't even clean up.", "rating": 16 },
    { "keyword": "Edu", "roast": "Edu startup? Your curriculum is all fail.", "rating": 6 },
    { "keyword": "News", "roast": "News app? You spread fake failure faster.", "rating": 17 },
    { "keyword": "Tech", "roast": "Tech startup? You tech me not to invest.", "rating": 0 },
    { "keyword": "Sport", "roast": "Sport startup? You just dropped the ball.", "rating": 29 },
    { "keyword": "Cloudify", "roast": "Cloudify? Your cloud just rains bugs.", "rating": 7 },
    { "keyword": "Track", "roast": "Track startup? You lost the trail already.", "rating": 23 },
    { "keyword": "Scan", "roast": "Scan tech? You just scanned yourself out of business.", "rating": 32 },
    { "keyword": "Print", "roast": "Print startup? Your pages are blank.", "rating": 28 },
    { "keyword": "Link", "roast": "Link startup? Your connections are dead ends.", "rating": 18 },
    { "keyword": "Grow", "roast": "Grow startup? Your growth is just weeds.", "rating": 12 },
    { "keyword": "Drive", "roast": "Drive startup? You just stalled.", "rating": 9 },
    { "keyword": "Clean", "roast": "Clean tech? Your mess is digital.", "rating": 13 },
    { "keyword": "Build", "roast": "Build startup? Your foundation is shaky.", "rating": 7 },
    { "keyword": "Code", "roast": "Code startup? Your code crashed before launch.", "rating": 8 },
    { "keyword": "Map", "roast": "Map startup? You lost your own way.", "rating": 10 },
    { "keyword": "Test", "roast": "Test startup? You failed every one.", "rating": 5 },
    { "keyword": "Secure", "roast": "Security startup? You leak more than protect.", "rating": 4 },
    { "keyword": "Save", "roast": "Save app? You just wasted my time.", "rating": 4 },
    { "keyword": "Jump", "roast": "Jump startup? You fell flat.", "rating": 3 },
    { "keyword": "Lift", "roast": "Lift startup? You just pulled your own plug.", "rating": 19 },
    { "keyword": "Assistant", "roast": "As helpful as a screen door on a submarine. Useless.", "rating": 5 },
    { "keyword": "Sharing", "roast": "Never has their wallet. Convenient.", "rating": 2 },
    { "keyword": "Care", "roast": "Cares less than I do about diets. Zero.", "rating": 1 },
    { "keyword": "Friendly", "roast": "Like a telemarketer. Unwanted.", "rating": 7 },
    { "keyword": "Electric", "roast": "Shocks worse than a surprise bill. Ouch.", "rating": 20 },
    { "keyword": "Analytics", "roast": "Random noise. My grandma's TikToks make more sense.", "rating": 8 },
    { "keyword": "Media", "roast": "Spreads gossip. Fast and furious.", "rating": 17 },
    { "keyword": "Service", "roast": "Slower than molasses. Is anyone working?", "rating": 6 },
    { "keyword": "Mobile", "roast": "Heavy as a brick. My foot hurts.", "rating": 11 },
    { "keyword": "Online", "roast": "Ghosting everyone. Where did they go?", "rating": 8 },
    { "keyword": "Booking", "roast": "Stressful. Like last-minute concert tickets.", "rating": 8 },
    { "keyword": "Automation", "roast": "Automates failures. One job!", "rating": 9 },
    { "keyword": "Club", "roast": "Empty. No one showed up.", "rating": 26 },
    { "keyword": "Editing", "roast": "Makes it worse. Like a bad haircut.", "rating": 0 },
    { "keyword": "Conference", "roast": "Email would be better. Waste of time.", "rating": 12 },
    { "keyword": "Development", "roast": "Creates problems faster. Endless cycle.", "rating": 14 },
    { "keyword": "Platform", "roast": "Sinks faster than my mood. Bye bye.", "rating": 16 },
    { "keyword": "Streaming", "roast": "Drips like a leaky faucet. So little.", "rating": 8 },
    { "keyword": "Wearables", "roast": "Fashion disaster. And useless.", "rating": 3 },
    { "keyword": "Gateway", "roast": "To frustration. Access denied.", "rating": 21 },
    { "keyword": "Watch", "roast": "Wrong time. Like my ex's promises.", "rating": 15 },
    { "keyword": "Digital", "roast": "Old as a rotary phone. Outdated.", "rating": 13 },
    { "keyword": "Exchange", "roast": "Promises gains, delivers empty. Tricked.", "rating": 9 },
    { "keyword": "Gaming", "roast": "Powered by rage quits. Not relaxing.", "rating": 8 },
    { "keyword": "Virtual", "roast": "All surface, no substance. Fake.", "rating": 8 },
    { "keyword": "Augmented", "roast": "Adds problems. Makes things worse.", "rating": 7 },
    { "keyword": "Machine", "roast": "Jams more than it runs. Get a new one.", "rating": 9 },
    { "keyword": "Learning", "roast": "Slow like a toddler. It's a process.", "rating": 4 },
    { "keyword": "Big", "roast": "Big talk, tiny results. All bark.", "rating": 7 },
    { "keyword": "Storage", "roast": "Full of junk. Declutter!", "rating": 5 },
    { "keyword": "Cyber", "roast": "Security as weak as my diet resolve. Broken.", "rating": 9 },
    { "keyword": "Security", "roast": "Protects like a wet paper bag. Easy access.", "rating": 19 },
    { "keyword": "Tutoring", "roast": "Gives up fast. Like my diet.", "rating": 6 },
    { "keyword": "Rental", "roast": "Glitches galore. Just return it.", "rating": 10 },
    { "keyword": "Renewable", "roast": "Like my excuses. Never-ending.", "rating": 8 },
    { "keyword": "Energy", "roast": "Drains phone battery. Fast.", "rating": 3 },
    { "keyword": "Agriculture", "roast": "More weeds than yield. Time to clean.", "rating": 11 },
    { "keyword": "Coach", "roast": "Yells, teaches nothing. Broken record.", "rating": 2 },
    { "keyword": "Meditation", "roast": "Stresses me out. Mind racing.", "rating": 24 },
    { "keyword": "Podcast", "roast": "Puts listeners in a coma. So boring.", "rating": 1 },
    { "keyword": "Graphic", "roast": "Colors clash. My eyes hurt.", "rating": 5 },
    { "keyword": "Design", "roast": "Pixel mess. Did a toddler draw this?", "rating": 20 },
    { "keyword": "Tool", "roast": "More toy than tool. Useless.", "rating": 22 },
    { "keyword": "Software", "roast": "Crashes like my social life. Abruptly.", "rating": 8 },
    { "keyword": "VPN", "roast": "Leaks data. What's the point?", "rating": 7 },
    { "keyword": "Password", "roast": "Forgets keys. Like my grocery list.", "rating": 1 },
    { "keyword": "Email", "roast": "Spam factory. Zero respect.", "rating": 6 },
    { "keyword": "SEO", "roast": "Buries you in search hell. Lost.", "rating": 12 },
    { "keyword": "Content", "roast": "So boring. Invisible.", "rating": 2 },
    { "keyword": "Management", "roast": "Messes everything up. Chaos.", "rating": 3 },
    { "keyword": "Event", "roast": "Forgotten fast. What happened?", "rating": 7 },
    { "keyword": "Hosting", "roast": "Slow as paint drying. Load already!", "rating": 16 },
    { "keyword": "Customer", "roast": "Ghosts you. Support? Never heard of it.", "rating": 13 }
  ],
    "fallback_roasts": [
{ "roast": "That idea? I've seen better pitches at a little league game.", "rating": 4 },
    { "roast": "Your startup's so confusing, even ChatGPT gave up.", "rating": 3 },
    { "roast": "Sounds like a solution desperately looking for a problem.", "rating": 3 },
    { "roast": "That’s not a pitch. That’s a cry for funding.", "rating": 6 },
    { "roast": "Your startup could get ghosted by investors *and* Tinder matches.", "rating": 2 },
    { "roast": "If ambition were execution, you'd still be in beta.", "rating": 4 },
    { "roast": "It’s giving ‘pivot in six months’ energy.", "rating": 7 },
    { "roast": "That pitch was so dry, even your TAM fell asleep.", "rating": 5 },
    { "roast": "Your idea’s got potential. To waste everyone's time.", "rating": 4 },
    { "roast": "Startup so vague it makes Web3 look straightforward.", "rating": 3 },
    { "roast": "Your elevator pitch needs stairs. And a nap.", "rating": 4 },
    { "roast": "That startup would be hot—if it were on fire.", "rating": 6 },
    { "roast": "You really said: ‘What if we made it worse, but scalable?’", "rating": 5 },
    { "roast": "Investors will pass faster than your page load time.", "rating": 8 },
    { "roast": "The only thing you’re disrupting is investor patience.", "rating": 7 },
    { "roast": "Your pitch deck just caused a market crash. Emotionally.", "rating": 5 },
    { "roast": "That idea belongs in a group chat, not a cap table.", "rating": 2 },
    { "roast": "You just reinvented failure. But with worse UX.", "rating": 7 },
    { "roast": "If buzzwords could code, maybe you'd have a product.", "rating": 5 },
    { "roast": "I’ve seen stealth startups with more clarity.", "rating": 2 },
    { "roast": "That pitch just soft-launched my will to live.", "rating": 6 },
    { "roast": "The future is here — and it's asking you to stop.", "rating": 5 },
    { "roast": "Your MVP stands for 'Most Vague Pitch.'", "rating": 5 },
    { "roast": "You just pitched a PowerPoint with trauma.", "rating": 6 },
    { "roast": "It's not a startup, it's a startup-themed escape room.", "rating": 8 },
    { "roast": "If confusion were a business model, you’d be profitable.", "rating": 5 },
    { "roast": "Your roadmap looks like a toddler’s crayon drawing.", "rating": 1 },
    { "roast": "Even your burn rate is ashamed of being associated.", "rating": 5 },
    { "roast": "You’re not pre-revenue, you're pre-relevance.", "rating": 6 },
    { "roast": "The pitch was so weak, it needs a Series A... of therapy.", "rating": 5 },
    { "roast": "You should pivot. Preferably into another industry.", "rating": 4 },
    { "roast": "Your ‘tech stack’ is just buzzwords duct-taped together.", "rating": 6 },
    { "roast": "That idea should’ve stayed in your Notes app.", "rating": 5 },
    { "roast": "You’re solving a problem no one has with tools no one needs.", "rating": 1 },
    { "roast": "I’ve heard fewer red flags in a North Korean parade.", "rating": 5 },
    { "roast": "Your market size is you, your cofounder, and your moms.", "rating": 4 },
    { "roast": "Investors would rather Venmo a scammer.", "rating": 4 },
    { "roast": "You talk lean but that pitch was all bloat.", "rating": 3 },
    { "roast": "The best part of your startup is the logo — maybe.", "rating": 4 },
    { "roast": "That’s not disruption. That’s digital littering.", "rating": 3 },
    { "roast": "Is your valuation based on vibes?", "rating": 6 },
    { "roast": "Your idea was so bad, autocorrect changed it to ‘stop.’", "rating": 6 },
    { "roast": "You're a unicorn — if failure was rare.", "rating": 3 },
    { "roast": "That’s not a pitch. That’s a DDoS on common sense.", "rating": 4 },
    { "roast": "Your startup's USP is how fast people walk away.", "rating": 5 },
    { "roast": "You built a rocket to nowhere. Congrats on lift-off.", "rating": 2 },
    { "roast": "Your ‘innovation’ is just a rerun with worse actors.", "rating": 9 },
    { "roast": "That pitch was so early, it’s still an embryo.", "rating": 8 },
    { "roast": "Your addressable market is probably just your reflection.", "rating": 7 },
    { "roast": "You made a startup nobody needed — not even ironically.", "rating": 5 },
    { "roast": "It’s like Uber, but for disappointing your parents.", "rating": 4 },
    { "roast": "Your demo crashed and so did our hopes.", "rating": 5 },
    { "roast": "You pitched an app that solves nothing but your boredom.", "rating": 7 },
    { "roast": "Even your NDA wants to forget this.", "rating": 6 }
    ]


};

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
// Search pitches by keyword substring
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

  const { data, error } = await supabase
    .from("pitch_roasts")
    .select("*")
    .ilike("idea", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: "Search query failed." });

  res.json(data);
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
