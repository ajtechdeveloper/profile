# George Ninan - 3D Spatial Timeline Portfolio

Interactive, production-ready 3D Spatial Timeline Portfolio architected with **React 18**, **Three.js**, **React Three Fiber**, **@react-three/drei**, and **GSAP ScrollTrigger**, featuring a procedural Web Audio API sci-fi synthesizer and optimized for static deployment on **GitHub Pages**.

---

## 🚀 Key Features

1. **Stage 1 (The Present - Hero Landing)**:
   - Dynamic 3D **Quantum Gyroscope & Neural Core** with concentric gimbal rings and orbital satellites.
   - High-contrast HUD displaying Name, Executive Headline, and key engineering telemetry metrics.
2. **Stage 2 (The Chronological Flight Path - 8 Career Milestones)**:
   - Camera smoothly glides down a vertical orbital trajectory encountering authentic real-world spacecraft and exploration vessels matching the space theme:
     - **Sage (2022–Present)**: Deep-Space Autonomous AI Observatory (James Webb replica with deployable gold hexagonal beryllium mirrors, secondary reflector tripod, and multi-layer sunshield pallet).
     - **Apptio (2020–2022)**: Modular International Space Station (ISS) Habitat & Node (pressurized laboratory cylinder, docking collars, structural truss, Cupola observation dome, and dual deployable solar array wings).
     - **JPMorgan Chase & Co. (2016–2020)**: Lunar Exploration Lander (Apollo / Artemis LEM with faceted gold MLI thermal descent stage, articulated landing legs & footpads, titanium crew cabin, and RCS quad thrusters).
     - **Ola (2015–2016)**: Global Telemetry & GPS / Comms Relay Satellite (gold-blanket satellite bus, gimbaled parabolic high-gain telemetry dish, phased-array IoT antennas, articulated solar wings, and xenon ion thruster).
     - **FICO (2013–2015)**: Voyager Interstellar Deep-Space Probe (iconic 3.7m parabolic high-gain reflector dish, decagonal equipment bus, the Golden Record mounted on the chassis, magnetometer boom, and RTG power canisters).
     - **Metabyte (2011–2013)**: Astrometric Survey & Precision Mapping Spacecraft (Gaia-class precision space telescope with conical deployable sunshield base, twin optical entrance baffles, and star tracker optics).
     - **J.P. Morgan (2009–2011)**: DART Planetary Defense Spacecraft & Kinetic Shield (heavy reinforced titanium Whipple micrometeoroid shield, compact cubic bus with gold foil, dual ROSA solar wings, and DRACO optical navigation camera).
     - **Satyam (2005–2009)**: Pioneer 10 First-Generation Deep-Space Pioneer (foundational parabolic antenna dish, gold-wrapped hexagonal equipment chassis, long radio dipole whip antennas, and particle sensor booms).
   - Interactive **"EXPAND CHRONICLE // SPECS"** modal for each milestone.
3. **Stage 3 (The Skill Constellation)**:
   - Interactive 3D orbiting skill cloud with hover expansion, audio feedback, and category breakdowns.
   - Verified Certifications (CSM, Generative AI for Leaders, LLMs From Scratch) and Academic foundation.
4. **Stage 4 (The Terminal - Contact/Footer)**:
   - Camera lands on a 3D architectural landing platform with an illuminated cyber terminal.
   - Instant direct email link, one-click email copying, and LinkedIn profile link.
5. **Procedural Web Audio API Synthesizer**:
   - Zero external audio files. Generates real-time ambient deep-space drone with resonant filter sweeps and responsive telemetry hover/click blips. Features an interactive mute/unmute HUD toggle.
6. **Optimized for GitHub Pages**:
   - `base: './'` relative path configuration in `vite.config.js`.
   - Procedural geometry throughout for instant initial load without multi-megabyte GLB downloads.
   - Included GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic deployment on push.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:5173/](http://localhost:5173/) to explore the portfolio.

---

## 📦 Production Static Build

```bash
# Build the static distribution bundle
npm run build
```

The compiled, static site is generated in the `./dist` folder and is ready to deploy directly to GitHub Pages or any static CDN.
