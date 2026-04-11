# CineSpike 🎬

> AI-powered movie trailer analysis — instantly generate genre tags, find comparable films, profile Reddit audiences, and generate deep-dive AI marketing campaigns completely offline!

Welcome to CineSpike! This repository contains a full-stack Flask application. The backend handles the heavy lifting (Local LLM via Ollama, ChromaDB vector search, algorithmic tagging) while the frontend is a clean, API-driven HTML/CSS/JS interface.

---

## 🚀 Quick Start for Friends & Collaborators

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd filmspike
```

### 2. Set up your Python environment
It's highly recommended to use a virtual environment so you don't clutter your system Python.
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```
*(Note: If you have a decent GPU and want automatic video-tagging via PyTorch/CLIP, make sure you uncomment the PyTorch-related lines at the bottom of `requirements.txt` before installing. Otherwise it will gracefully drop back to manual tag selection).*

### 4. Populate the Vector Database (Run ONCE)
We use a dataset of roughly 5000 movies. To download them and embed them into our local `chroma_db`, run:
```bash
python ingest.py
```
*Depending on your internet speed, this takes about 1-3 minutes. You only ever have to run this once.*

### 5. Start the App!
```bash
python app.py
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 🤖 (Optional) Hooking up "Ollama" for AI Campaigns

On the results dashboard, there is a **Generate AI Strategy (Local)** button. This button connects to your local machine's AI to write a highly detailed Reddit-focused marketing campaign based on the trailer data.

To make this button work:
1. Download and install **[Ollama](https://ollama.com/)**
2. Open your terminal and run:
   ```bash
   ollama run llama3
   ```
3. Keep Ollama running in the background. Now, when you click the button in CineSpike, it will use Llama 3 to write your campaign!

---

## 👨‍💻 How to Change the Code

The app is built "API-First". This means the Python backend simply serves data, and the Javascript frontend decides how to display it. 

### **Want to change the design or colors?**
Open `static/css/style.css`. Scroll to the very top to the `:root` section. Change the hex codes like `--clr-accent: #e94560;` and it will instantly theme the entire website.

### **Want to change the layout or add sections?**
- The homepage layout is in `templates/index.html`.
- The dashboard layout is in `templates/results.html`. To add new widgets, simply add `div` containers in the HTML exactly where you want them.

### **Want to change the AI prompt or reasoning logic?**
Open `release_planner.py`. Look for the `generate_ollama_campaign` function. You can tweak the massive text prompt sent to Llama 3 to make it focus on whatever you want (e.g., "Write a TikTok campaign instead of a Reddit campaign").

### **Want to change how charts look?**
Open `static/js/results.js`. We use `Chart.js`. Scroll down to the `renderRelease()` function and you can change the graph colors, axis labels, and animations there.

---

## 📂 Project Structure
```text
filmspike/
├── app.py               → The main brain. Starts the server and defines APIs.
├── ingest.py            → Downloads TMDB movies + embeds them.
├── release_planner.py   → Talks to Ollama to generate campaign strategies.
├── vector_store.py      → Searches ChromaDB for similar movies.
├── tag_generator.py     → Uses CLIP (if installed) to watch your trailer.
├── reddit_mapper.py     → Synthetic mapping of movie genres to subreddits.
├── templates/           → HTML files
└── static/              
    ├── css/style.css    → The main stylesheet
    └── js/results.js    → Connects the HTML to the backend data APIs.
```
