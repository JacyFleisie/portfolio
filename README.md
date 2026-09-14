# Grootbek Biltong

Premium biltong products website. Built with HTML, CSS, JavaScript, and Three.js.

## Live Demo

[View Live Site](https://jacyfleisie.github.io/grootbek/)

## Run Locally

### Option 1: Direct file open
Open `index.html` in your browser — no server needed.

### Option 2: Local development server
```bash
cd site
python3 -m http.server 8080
```
Then open `http://localhost:8080/`

### Option 3: Access from any device (phone, tablet, etc.)
```bash
# Install localtunnel
npm install -g localtunnel

# Start your server (see Option 2)
python3 -m http.server 8080

# In a new terminal, create a public URL
lt --port 8080
```
Copy the URL it gives you (e.g., `https://random-name.loca.lt`) — open it on any device with internet.

### Option 4: Share on same Wi-Fi
```bash
python3 -m http.server 8080 --bind 0.0.0.0
```
Then find your local IP (`ipconfig` on Windows, `ifconfig` on Mac/Linux) and share `http://YOUR_IP:8080`

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, flexbox, grid, animations
- **JavaScript** — Vanilla JS, no frameworks
- **Three.js** — 3D laptop background with scroll-linked animation
- **Devicons** — Tech stack icons

## Features

- Responsive design (mobile, tablet, desktop)
- Smooth scroll animations
- 3D interactive background
- SEO optimized
- Fast loading

## License

MIT
