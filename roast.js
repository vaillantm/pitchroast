const API = "http://localhost:3000";
const btnHome = document.getElementById("btnHome");
const btnLeaderboard = document.getElementById("btnLeaderboard");
const homeSection = document.getElementById("home-section");
const lbSection = document.getElementById("leaderboard-section");
const loginUser = document.getElementById("loginUser");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userStats = document.getElementById("userStats");
const statName = document.getElementById("statName");
const statCount = document.getElementById("statCount");
const statAverage = document.getElementById("statAverage");
const userNameInput = document.getElementById("userName");
const pitchInput = document.getElementById("pitch");
const voiceSelect = document.getElementById("voice");
const roastBtn = document.getElementById("roastBtn");
const messageDiv = document.getElementById("message");
const roastResultDiv = document.getElementById("roastResult");
const audioPlayer = document.getElementById("audioPlayer");
const recentRoastsDiv = document.getElementById("recentRoasts");
const lbBestDiv = document.getElementById("leaderboardBest");
const lbWorstDiv = document.getElementById("leaderboardWorst");

let currentUser = null;

btnHome.addEventListener("click", () => {
  btnHome.classList.add("active");
  btnLeaderboard.classList.remove("active");
  homeSection.classList.remove("hidden");
  lbSection.classList.add("hidden");
  loadRecent();
});

btnLeaderboard.addEventListener("click", () => {
  btnLeaderboard.classList.add("active");
  btnHome.classList.remove("active");
  lbSection.classList.remove("hidden");
  homeSection.classList.add("hidden");
  loadLeaderboard();
});

loginBtn.addEventListener("click", async () => {
  const name = loginUser.value.trim();
  if (!name) return;
  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username: name })
  });
  if (res.ok) {
    currentUser = name;
    loginUser.classList.add("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    userStats.classList.remove("hidden");
    loadUserStats();
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch(API + "/logout", { method:"POST" });
  currentUser = null;
  loginUser.classList.remove("hidden");
  loginBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  userStats.classList.add("hidden");
});

roastBtn.addEventListener("click", async () => {
  const pitch = pitchInput.value.trim();
  if (!pitch) {
    messageDiv.textContent = "Enter a pitch.";
    messageDiv.className = "message error";
    return;
  }
  const user = userNameInput.value.trim() || "Anonymous";
  messageDiv.textContent = "Roasting...";
  messageDiv.className = "message";

  const res = await fetch(API + "/roast", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ pitch, user_name: currentUser||user, voice: voiceSelect.value })
  });

  const data = await res.json();
  if (!res.ok) {
    messageDiv.textContent = data.error;
    messageDiv.className = "message error";
    return;
  }
  roastResultDiv.innerHTML = `💣 ${data.roast} (🔥 ${data.rating}/50)`;
  messageDiv.textContent = "Logged!";
  messageDiv.className = "message success";
  audioPlayer.src = data.audio_url;
  audioPlayer.classList.remove("hidden");
  audioPlayer.play();
  loadRecent();
  if (currentUser) loadUserStats();
});

async function loadRecent() {
  const res = await fetch(API + "/recent");
  const arr = await res.json();
  recentRoastsDiv.innerHTML = arr.length
    ? arr.map(r => `<p><strong>${r.idea}</strong> — ${r.roast} (${r.rating}/50) — <em>${r.user_name}</em></p>`).join("")
    : "<p>No roasts yet.</p>";
}

async function loadLeaderboard() {
  const res = await fetch(API + "/leaderboard");
  const data = await res.json();
  lbBestDiv.innerHTML = renderTable(data.best);
  lbWorstDiv.innerHTML = renderTable(data.worst);
}

async function loadUserStats() {
  const res = await fetch(API + `/user-stats?username=${encodeURIComponent(currentUser)}`);
  const st = await res.json();
  statName.textContent = `👤 ${st.username}`;
  statCount.textContent = `Pitches: ${st.count}`;
  statAverage.textContent = `Avg Rating: ${st.avg_rating.toFixed(2)}/50`;
}

function renderTable(rows) {
  if (!rows.length) return "<p>No data.</p>";
  let html = "<table><thead><tr><th>#</th><th>Idea</th><th>Rating</th><th>User</th></tr></thead><tbody>";
  rows.forEach((r,i) => html += `<tr><td>${i+1}</td><td>${r.idea}</td><td>${r.rating}/50</td><td>${r.user_name}</td></tr>`);
  return html + "</tbody></table>";
}

loadRecent();
