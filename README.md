# 🇮🇳 NSG C4ISR Tactical Command & Control System

> **Motto:** *"सर्वत्र सर्वोत्तम सुरक्षा"* (Omnipresent Omnipotent Security)  
> **Joint Operations Command Core:** Manesar Garrison HQ, National Capital Region (NCR), India

An interactive, military-grade **C4ISR (Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance)** dashboard prototype designed for tactical defense operations, counter-terrorism monitoring, and multi-sensor surveillance management.

---

## 📌 Overview

This tactical command center prototype models the defense operations console of the **National Security Guard (NSG)**, India’s elite special forces unit under the Ministry of Home Affairs. It provides real-time situational awareness across regional task forces, automated threat intelligence, multi-camera surveillance with optical/thermal filters, and interactive geospatial mapping across all six regional NSG deployment hubs in India.

---

## ⚡ Core Operational Modules

### 1. 🎛️ System Hub (`index.html`)
The central command and force readiness dashboard:
- **Force Posture & DEFCON Status:** Live national alert level gauge (Condition Green / Amber / Red).
- **Special Action Groups (SAG):** Status indicators for **51 SAG** (Counter-Terrorism Task Force) and **52 SAG** (Anti-Hijack Unit).
- **Satellite Communications Uplink:** Encrypted telemetry channel via dedicated military satellite (GSAT-7A).
- **Perimeter Sensor Matrix:** Live status of automated optical, seismic, and infrared fence sensors.
- **Regional Hub Status List:** Quick-view operational status for Manesar HQ and regional hubs.
- **Dual Military Clocks:** Synchronized **Indian Standard Time (IST)** and **NATO Zulu Time (UTC Date-Time Group: e.g., `031230Z NOV 26`)**.

### 2. 📡 Live Tactical Surveillance (`monitor.html`)
The primary video reconnaissance and geospatial monitoring console:
- **4-Feed Camera Matrix:**
  - **CAM 01 (Exterior Perimeter Cordon):** Live surveillance feed with optical target bounding boxes.
  - **CAM 02 (Secure Concourse / Transit):** Real-time motion surveillance and vehicle transit tracking.
  - **CAM 03 (Local Optical / Biometrics):** Optical feed with automated biometric scanning.
  - **CAM 04 (Tactical Drone UAV Recon):** Synthetic drone reconnaissance feed with flight telemetry (Altitude, Battery %, Heading, GPS Lock) and asset profiling.
- **Multi-Spectrum Camera Filters:** Instant toggle on every camera feed:
  - `OPT` — High-definition Optical spectrum.
  - `NVG` — Night Vision Green phosphorus filter.
  - `FLIR` — Forward-Looking Infrared (Thermal imaging).
- **Interactive Geospatial Map (Leaflet.js):**
  - Dark tactical base map centered on India.
  - Interactive tactical pins for all 6 NSG Regional Hubs.
  - Manesar Garrison 8km security cordon perimeter ring.
  - Quick-focus buttons (`ALL HUBS`, `MANESAR HQ`, `MUMBAI`, `KOLKATA`, `CHENNAI`, `HYDERABAD`).
- **Live Threat Stream & Operational Timeline:** Real-time chronological incident logs and alert dispatch feeds.
- **Emergency Lockdown Protocol:** Full-screen tactical override modal with voice synthesis alerts.

### 3. 📊 Intelligence Archive (`reports.html`)
Post-action intelligence retrieval and analytical reporting:
- **KPI Summary Row:** Total surveillance logs, critical threat escalations, elevated advisories, and readiness posture index (98.4%).
- **Threat Distribution Chart:** HTML5 Canvas bar chart breaking down incidents across regional command hubs.
- **Official Military SITREP Generator:** Standardized defense Situation Report with Date-Time Group (DTG), security classification (*RESTRICTED // FOUO*), primary threat vectors, and a 1-click **Print/Export SITREP** action.
- **Decrypted Historical Logs:** Filterable data table by severity (`ALL`, `CRITICAL ONLY`, `ELEVATED ONLY`).

---

## 🗺️ NSG Regional Operational Hubs

| Hub | Location | Coordinates | Tactical Role |
| :--- | :--- | :--- | :--- |
| **Manesar HQ** | Gurugram, Haryana (NCR) | `28.3588° N, 76.9404° E` | Primary C4ISR Command Core & Training Centre (51 & 52 SAG) |
| **Mumbai Hub** | Kalina / Marol, Maharashtra | `19.0760° N, 72.8777° E` | Western Sector Rapid Reaction Task Force |
| **Kolkata Hub** | Badu / New Town, West Bengal | `22.6840° N, 88.4710° E` | Eastern Sector Counter-Terror Command |
| **Chennai Hub** | Nedunkundram, Tamil Nadu | `12.8988° N, 80.1284° E` | Southern Sector Coastal & Airborne QRT |
| **Hyderabad Hub** | Ibrahimpatnam, Telangana | `17.1950° N, 78.6500° E` | Deccan Quick Reaction Task Force |
| **Gandhinagar Hub** | Gandhinagar, Gujarat | `23.2156° N, 72.6369° E` | Western Border & Critical Infrastructure Protection |

---

## 🛠️ Technology Stack

- **Markup & Layout:** HTML5 Semantic Structure
- **Styling:** Vanilla CSS3 (Custom C4ISR dark tactical theme, CSS Grid & Flexbox, responsive layouts)
- **Scripting:** Modern ES6+ JavaScript (zero external framework dependencies)
- **Mapping:** [Leaflet.js](https://leafletjs.com/) v1.9.4 with CartoDB Dark Matter tile layer
- **Audio & Comms:** Web Speech API (Synthesized tactical radio comms & alerts)
- **Data Visualization:** HTML5 Canvas 2D API for animated telemetry charts
- **Persistence:** Client-side Web Storage API (`localStorage`)

---

## 🚀 Getting Started

### Prerequisites
A modern desktop web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devakumar-A/nsg-prototype.git
   cd nsg-prototype
   ```

2. **Checkout the `realistic` branch:**
   ```bash
   git checkout realistic
   ```

3. **Launch the application:**
   Simply double-click `index.html` or open it in your browser:
   ```bash
   # On Windows PowerShell
   Start-Process index.html
   ```

---

## 🎮 Interactive Controls & Shortcuts

- **Mission Control (`monitor.html`):**
  - **AI SURVEILLANCE:** Toggle automated sensor scanning and threat logging.
  - **TACTICAL COMMS AUDIO:** Toggle synthetic vocal radio announcements on/off.
  - **TEST INCIDENT INJECTION:** Simulates a critical perimeter security alert in a randomized sector.
  - **PURGE INCIDENT CACHE:** Resets local incident storage and clears timeline streams.
- **Camera Filters:** Click `OPT`, `NVG`, or `FLIR` on any camera feed header to switch spectrum modes.
- **Map Navigation:** Click any hub button in the map toolbar or click directly on any pulsing map marker to focus the camera on that garrison.

---

## 📄 License & Disclaimer

This project is an educational, interactive UI/UX defense dashboard prototype created for simulation, portfolio, and demonstrational purposes. All tactical terms, callsigns, and simulated telemetry are modeled for demonstration.
