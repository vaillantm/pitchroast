import json
import random
import requests
from datetime import datetime
from supabase import create_client, Client
import streamlit as st
import pandas as pd
import base64

# --- Supabase Config ---
SUPABASE_URL = "https://ekwlberslednlfxhnytq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrd2xiZXJzbGVkbmxmeGhueXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzAwMzksImV4cCI6MjA2NDQ0NjAzOX0.TaBGlA2c-2CFqpOLyS-yIRrIN56Pcb07ow2Dz-_1yL8"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Load Roast Data ---
with open("rate.json", "r") as f:
    roast_data = json.load(f)

keyword_roasts = roast_data["keyword_roasts"]
fallback_roasts = roast_data["fallback_roasts"]

# --- Roast Logic ---
def find_roast(pitch):
    pitch_lower = pitch.lower()
    for item in keyword_roasts:
        if item["keyword"].lower() in pitch_lower:
            return item["roast"], item["rating"], item["keyword"]
    fallback = random.choice(fallback_roasts)
    return fallback["roast"], fallback["rating"], "fallback"

# --- TTS URL Generator ---
def free_tts_url(text, voice):
    return f"https://api.streamelements.com/kappa/v2/speech?voice={voice}&text={requests.utils.quote(text)}"

# --- Streamlit Page Config ---
st.set_page_config(page_title="Pitch Roast 🔥", layout="wide")

# --- Custom Styles ---
st.markdown("""
<style>
/* Background and text */
body, .stApp {
    background-color: #121212;
    color: white !important;
    font-family: 'Segoe UI', sans-serif;
}

/* Headings, labels */
h1, h2, h3, h4, h5, h6, .stTextInput label, .stSelectbox label, .stCaption {
    color: white !important;
}

/* Links */
a {
    color: #ff4500;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}

/* Tables */
table, th, td {
    border: 1px solid #3a4d6c;
    color: white;
}
th {
    background-color: #ff4500;
    color: white !important;
}
tr:nth-child(even) {
    background-color: #2b2b2b;
}

/* Buttons */
.stButton > button {
    background-color: #ff4500;
    color: white;
}
.stButton > button:hover {
    background-color: #e03e00;
}

/* Sidebar style */
.sidebar-style {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 12px;
    height: 100%;
}

/* Sidebar options - make text white and highlight selected */
.sidebar-option {
    padding: 10px 0;
    font-weight: bold;
    cursor: pointer;
    color: white !important;
}
.sidebar-selected {
    color: #ff4500 !important;
}

/* Sidebar radio buttons fix - white text */
[role="radiogroup"] > div > label {
    color: white !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    /* Stack sidebar and content vertically on mobile */
    .css-1d391kg {  /* Streamlit columns container */
        flex-direction: column !important;
    }
    .css-1d391kg > div {
        width: 100% !important;
    }
}
</style>
""", unsafe_allow_html=True)

# --- Load and encode logo.png once ---
with open("logo.png", "rb") as f:
    data = f.read()
    encoded_logo = base64.b64encode(data).decode()

# --- Layout ---
sidebar_col, content_col = st.columns([1, 4])

# --- Sidebar ---
with sidebar_col:
    st.markdown("## 🔥 Pitch Roast")
    st.markdown('<div class="sidebar-style">', unsafe_allow_html=True)
    menu_options = {
        "🏠 Home": "home",
        "🏆 Leaderboard": "leaderboard",
        "📊 Your Stats": "stats"
    }
    selected = st.radio("Navigate", list(menu_options.keys()), label_visibility="collapsed")
    st.markdown('</div>', unsafe_allow_html=True)

# --- Main Content ---
with content_col:
    if menu_options[selected] == "home":
        # Clickable logo image linked to https://bolt.new
        st.markdown(
            f'''
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
                <img src="data:image/png;base64,{encoded_logo}" alt="Logo" style="width:auto; height:auto; max-width:100px;" />
            </a>
            ''',
            unsafe_allow_html=True
        )

        st.title("🎤 Pitch Roast 🔥")
        st.caption("Type your startup idea and get roasted mercilessly by AI.")

        user_name = st.text_input("Your name or alias (optional):", placeholder="Anonymous")
        pitch = st.text_input("Your startup pitch:", placeholder="e.g. Uber for dog walking")
        voice = st.selectbox("Choose TTS voice:", ["Brian", "Ivy", "Justin", "Joey", "Salli", "Matthew"])

        if st.button("🔥 Roast Me"):
            if not pitch.strip():
                st.warning("Please enter a pitch.")
            else:
                roast, rating, keyword = find_roast(pitch)
                st.error(f"💣 {roast} (🔥 {rating}/50)")
                st.audio(free_tts_url(roast, voice), format="audio/mp3")

                supabase.table("pitch_roasts").insert({
                    "idea": pitch,
                    "roast": roast,
                    "rating": rating,
                    "user_name": user_name.strip() if user_name.strip() else "Anonymous",
                    "created_at": datetime.utcnow().isoformat()
                }).execute()

                st.success("🔥 Roasted and logged successfully!")

        st.markdown("### 📜 Recent Roasts")
        rows = supabase.table("pitch_roasts").select("*").order("created_at", desc=True).limit(5).execute()
        for row in rows.data:
            st.write(f"**{row['idea']}** — _{row['roast']}_ (🔥 {row['rating']}/50) — by *{row.get('user_name', 'Anonymous')}*")

    elif menu_options[selected] == "leaderboard":
        st.title("🏆 Roast Leaderboard")

        # Search input to filter by username for both best and worst ideas
        search_user = st.text_input("Search by username:", key="leaderboard_search")

        # Pagination params for infinite scroll simulation
        batch_size = 10
        if "best_offset" not in st.session_state:
            st.session_state.best_offset = 0
        if "worst_offset" not in st.session_state:
            st.session_state.worst_offset = 0

        def load_best_ideas(offset=0, limit=10, username=None):
            query = supabase.table("pitch_roasts").select("*").order("rating", desc=True).range(offset, offset + limit - 1)
            if username:
                query = query.eq("user_name", username)
            return query.execute().data

        def load_worst_ideas(offset=0, limit=10, username=None):
            query = supabase.table("pitch_roasts").select("*").order("rating", desc=False).range(offset, offset + limit - 1)
            if username:
                query = query.eq("user_name", username)
            return query.execute().data

        # Load initial data
        best_data = load_best_ideas(st.session_state.best_offset, batch_size, search_user if search_user else None)
        worst_data = load_worst_ideas(st.session_state.worst_offset, batch_size, search_user if search_user else None)

        def render_ideas(title, data, is_best=True):
            if not data:
                st.info("No ideas found.")
                return
            table_data = [{
                "Rank": i + 1 + (st.session_state.best_offset if is_best else st.session_state.worst_offset),
                "Idea": row['idea'],
                "Rating": f"{row['rating']}/50",
                "User": row.get('user_name', 'Anonymous')
            } for i, row in enumerate(data)]
            st.table(table_data)

        st.markdown("### 🌟 Best Ideas")
        render_ideas("Best Ideas", best_data, True)

        if st.button("Load more best ideas"):
            st.session_state.best_offset += batch_size
            best_data = load_best_ideas(st.session_state.best_offset, batch_size, search_user if search_user else None)
            render_ideas("Best Ideas", best_data, True)

        st.markdown("### 💩 Worst Ideas")
        render_ideas("Worst Ideas", worst_data, False)

        if st.button("Load more worst ideas"):
            st.session_state.worst_offset += batch_size
            worst_data = load_worst_ideas(st.session_state.worst_offset, batch_size, search_user if search_user else None)
            render_ideas("Worst Ideas", worst_data, False)

    elif menu_options[selected] == "stats":
        st.title("📊 Your Stats")

        # Search bar for username (retrieve stats on submit)
        name = st.text_input("Enter your username to view your stats:")

        if name:
            data = supabase.table("pitch_roasts").select("*").eq("user_name", name).execute()
            pitches = data.data
            if pitches:
                df = pd.DataFrame(pitches)
                total = len(df)
                average = round(df["rating"].mean(), 2)
                st.markdown(f"👤 **{name}** has submitted **{total}** pitches.")
                st.markdown(f"⭐ Average Roast Rating: **{average}/50**")
                st.markdown("### 🗒 Your Ideas")
                df_display = df[["idea", "roast", "rating", "created_at"]].rename(columns={
                    "idea": "Pitch",
                    "roast": "Roast",
                    "rating": "Rating",
                    "created_at": "Timestamp"
                })
                st.table(df_display)
            else:
                st.info("No data found for that user.")
