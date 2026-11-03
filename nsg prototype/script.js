/**
 * NSG TACTICAL COMMAND & CONTROL SYSTEM (C4ISR)
 * Joint Operations Core Engine v4.18-REL
 * Motto: "सर्वत्र सर्वोत्तम सुरक्षा" (Sarvatra Sarvottam Suraksha)
 */

/* ==========================================================================
   1. DATA PERSISTENCE & INCIDENT STATE
   ========================================================================== */
let total = parseInt(localStorage.getItem("nsg_total")) || 18;
let high = parseInt(localStorage.getItem("nsg_high")) || 2;
let medium = parseInt(localStorage.getItem("nsg_medium")) || 7;
let aiActive = true;
let voiceActive = true;

// Default realistic historical events
const defaultIncidents = [
    { time: "18:04:12", sector: "MANESAR HQ (NCR)", msg: "PERIMETER SENSOR TRIP: NORTH FENCE SECTOR-B", severity: "medium", disposition: "PATROL DISPATCHED" },
    { time: "17:42:05", sector: "MUMBAI HUB", msg: "SUSPICIOUS VEHICLE DWELL TIME: ENTRY GATE 2", severity: "medium", disposition: "CLEARED" },
    { time: "16:15:30", sector: "MANESAR HQ (NCR)", msg: "AUTHORIZED CONVOY TRANSIT VERIFIED", severity: "nominal", disposition: "LOGGED" },
    { time: "14:22:18", sector: "KOLKATA HUB", msg: "EO/IR THERMAL ANOMALY: PERIMETER CORNER 4", severity: "medium", disposition: "VERIFIED NOMINAL" },
    { time: "11:05:44", sector: "HYDERABAD HUB", msg: "ROUTINE QUICK REACTION DRILL EXECUTED", severity: "nominal", disposition: "COMPLETED" },
    { time: "09:30:10", sector: "CHENNAI HUB", msg: "PERIMETER MOTION TRIGGER (ANIMAL SIGHTING)", severity: "nominal", disposition: "RESOLVED" }
];

let incidents = JSON.parse(localStorage.getItem("nsg_incidents")) || defaultIncidents;

const saveData = () => {
    localStorage.setItem("nsg_total", total);
    localStorage.setItem("nsg_high", high);
    localStorage.setItem("nsg_medium", medium);
    localStorage.setItem("nsg_incidents", JSON.stringify(incidents));
};

/* ==========================================================================
   2. MILITARY COMMUNICATIONS & SPEECH SYNTHESIS
   ========================================================================== */
const speak = (msg) => {
    if (!voiceActive) return;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(msg);
        speech.rate = 0.95;
        speech.pitch = 0.85;
        window.speechSynthesis.speak(speech);
    }
};

/* ==========================================================================
   3. EMERGENCY & LOCKDOWN PROTOCOLS
   ========================================================================== */
const triggerLockdown = (zone, reason = "PERIMETER BREACH SUSPECTED") => {
    const body = document.getElementById('main-body');
    const popup = document.getElementById('emergency-popup');
    const desc = document.getElementById('alert-desc');
    const statusText = document.getElementById('threatConditionText');
    const defconPill = document.getElementById('defconPill');

    if (body) body.classList.add('emergency-mode');
    if (popup) popup.style.display = 'flex';
    if (desc) desc.innerText = `${reason.toUpperCase()} IN [${zone}]`;

    if (statusText) statusText.innerText = "CONDITION: RED (DEFCON 2)";
    if (defconPill) {
        defconPill.className = "defcon-pill critical";
    }

    speak(`Tactical alert. Incident verified in ${zone}. Quick Reaction Teams notified.`);
};

window.dismissEmergency = function () {
    const body = document.getElementById('main-body');
    const popup = document.getElementById('emergency-popup');
    const statusText = document.getElementById('threatConditionText');
    const defconPill = document.getElementById('defconPill');

    if (body) body.classList.remove('emergency-mode');
    if (popup) popup.style.display = 'none';

    if (statusText) statusText.innerText = "CONDITION: NORMAL (DEFCON 4)";
    if (defconPill) {
        defconPill.className = "defcon-pill";
    }

    speak("Security protocol verified. Resuming standard surveillance.");
};

/* ==========================================================================
   4. GEOSPATIAL MAP (LEAFLET.JS) - REGIONAL NSG HUBS
   ========================================================================== */
const NSG_HUBS = {
    manesar: {
        name: "MANESAR GARRISON HQ",
        role: "Joint Operations Command Core • 51 & 52 SAG",
        coords: [28.3588, 76.9404],
        zoom: 13,
        status: "PRIMARY HUB (DEFCON 4)"
    },
    mumbai: {
        name: "MUMBAI REGIONAL HUB",
        role: "Western Sector Task Force • Kalina",
        coords: [19.0760, 72.8777],
        zoom: 12,
        status: "ACTIVE PATROL"
    },
    kolkata: {
        name: "KOLKATA REGIONAL HUB",
        role: "Eastern Sector Quick Reaction Command",
        coords: [22.6840, 88.4710],
        zoom: 12,
        status: "ACTIVE PATROL"
    },
    chennai: {
        name: "CHENNAI REGIONAL HUB",
        role: "Southern Sector Rapid Response Unit",
        coords: [12.8988, 80.1284],
        zoom: 12,
        status: "ACTIVE PATROL"
    },
    hyderabad: {
        name: "HYDERABAD REGIONAL HUB",
        role: "Deccan Regional C4ISR Sub-Center",
        coords: [17.1950, 78.6500],
        zoom: 12,
        status: "STANDBY FORCES"
    },
    gandhinagar: {
        name: "GANDHINAGAR REGIONAL HUB",
        role: "Gujarat Maritime & Border Task Force",
        coords: [23.2156, 72.6369],
        zoom: 12,
        status: "ACTIVE PATROL"
    }
};

let tacticalMapInstance = null;
let hubMarkers = {};

const initTacticalMap = () => {
    const mapEl = document.getElementById('tacticalMap');
    if (!mapEl || typeof L === 'undefined') return;

    try {
        // Initialize Map centered on India
        tacticalMapInstance = L.map('tacticalMap', {
            zoomControl: false,
            attributionControl: false
        }).setView([22.5, 78.5], 4);

        // Dark Tactical CartoDB Tiles with fallback
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            subdomains: 'abcd',
            opacity: 0.95
        }).addTo(tacticalMapInstance);

        // Add custom markers for all NSG Hubs
        for (let key in NSG_HUBS) {
            const hub = NSG_HUBS[key];

            const iconHtml = `
                <div style="position:relative; width:16px; height:16px;">
                    <div style="position:absolute; width:16px; height:16px; border-radius:50%; background:rgba(14, 165, 233, 0.25); border:1px solid #0ea5e9; animation:pulse 2s infinite;"></div>
                    <div style="position:absolute; top:4px; left:4px; width:8px; height:8px; border-radius:50%; background:#0ea5e9;"></div>
                </div>
            `;

            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'tactical-map-pin',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            const marker = L.marker(hub.coords, { icon: customIcon }).addTo(tacticalMapInstance);
            
            marker.bindPopup(`
                <div style="font-family: monospace;">
                    <b style="color: #0ea5e9; font-size:11px;">${hub.name}</b><br>
                    <span style="color:#94a3b8; font-size:10px;">${hub.role}</span><br>
                    <span style="color:#10b981; font-size:10px; font-weight:bold;">${hub.status}</span>
                </div>
            `);

            marker.on('click', () => {
                focusHub(key);
            });

            hubMarkers[key] = marker;
        }

        // Draw Manesar Security Cordon Circle
        L.circle(NSG_HUBS.manesar.coords, {
            color: '#0ea5e9',
            fillColor: '#0ea5e9',
            fillOpacity: 0.1,
            radius: 8000,
            weight: 1,
            dashArray: '4 4'
        }).addTo(tacticalMapInstance);

    } catch (e) {
        console.error("Map initialization note:", e);
    }
};

window.focusHub = function (hubKey) {
    if (!tacticalMapInstance) return;

    // Update active button state
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(hubKey.toLowerCase())) {
            btn.classList.add('active');
        }
    });

    const targetNameEl = document.getElementById('map-target-name');
    const targetCoordsEl = document.getElementById('map-target-coords');

    if (hubKey === 'all') {
        tacticalMapInstance.setView([22.5, 78.5], 4);
        if (targetNameEl) targetNameEl.innerText = "ALL OPERATIONAL REGIONS";
        if (targetCoordsEl) targetCoordsEl.innerText = "6 NODES CONNECTED";
        return;
    }

    const hub = NSG_HUBS[hubKey];
    if (hub) {
        tacticalMapInstance.flyTo(hub.coords, hub.zoom, { duration: 1.2 });
        if (hubMarkers[hubKey]) {
            hubMarkers[hubKey].openPopup();
        }
        if (targetNameEl) targetNameEl.innerText = `TARGET: ${hub.name}`;
        if (targetCoordsEl) targetCoordsEl.innerText = `${hub.coords[0].toFixed(4)}° N, ${hub.coords[1].toFixed(4)}° E`;
    }
};

/* ==========================================================================
   5. CAMERA CONTROLS & REALISTIC FILTERS
   ========================================================================== */
window.setCamFilter = function (viewportId, filterClass, btn) {
    const viewport = document.getElementById(viewportId);
    if (!viewport) return;

    const media = viewport.querySelector('video, img');
    if (media) {
        media.className = filterClass;
    }

    // Button active state
    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('.cam-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
};

/* ==========================================================================
   6. REALISTIC AI SURVEILLANCE & INCIDENT LOGGING
   ========================================================================== */
const addAlert = (msg, severity = "medium", sector = "MANESAR HQ (NCR)") => {
    total++;
    severity === "high" ? high++ : medium++;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB');

    const newIncident = {
        time: timeStr,
        sector: sector,
        msg: msg,
        severity: severity,
        disposition: severity === "high" ? "ACTION REQUIRED" : "UNDER SURVEILLANCE"
    };

    incidents.unshift(newIncident);
    if (incidents.length > 30) incidents.pop();

    saveData();
    updateUI();
    renderIncidentStreams();
};

const renderIncidentStreams = () => {
    const alertBox = document.getElementById("alerts");
    const timeline = document.getElementById("timeline");
    const logsTable = document.getElementById("logsTableBody");

    // Render Live Threat Stream Cards
    if (alertBox) {
        alertBox.innerHTML = incidents.slice(0, 10).map(inc => `
            <div class="alert-item ${inc.severity === 'high' ? 'critical' : (inc.severity === 'medium' ? 'elevated' : '')}">
                <div class="alert-header">
                    <span class="alert-msg">${inc.msg}</span>
                    <span class="alert-time">${inc.time}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:9px; margin-top:2px;">
                    <span>ZONE: ${inc.sector}</span>
                    <span style="color:${inc.severity === 'high' ? 'var(--status-critical)' : 'var(--status-advisory)'}; font-weight:bold;">${inc.severity.toUpperCase()}</span>
                </div>
            </div>
        `).join("");
    }

    // Render Timeline Entries
    if (timeline) {
        timeline.innerHTML = incidents.slice(0, 8).map(inc => `
            <div class="timeline-entry ${inc.severity === 'high' ? 'critical' : (inc.severity === 'medium' ? 'elevated' : 'nominal')}">
                <span style="color:var(--text-muted);">[${inc.time}]</span>
                <span style="color:var(--text-primary); font-weight:500;"> ${inc.msg}</span>
                <div style="color:var(--text-muted); font-size:9px;">SECTOR: ${inc.sector} • ${inc.disposition}</div>
            </div>
        `).join("");
    }

    // Render Reports Table
    if (logsTable) {
        renderLogsTable('all');
    }
};

window.renderLogsTable = function (filterSeverity = 'all') {
    const logsTable = document.getElementById("logsTableBody");
    if (!logsTable) return;

    const filtered = filterSeverity === 'all' 
        ? incidents 
        : incidents.filter(i => i.severity === filterSeverity);

    logsTable.innerHTML = filtered.map(inc => `
        <tr>
            <td style="color:var(--text-muted);">${inc.time}</td>
            <td style="font-weight:600; color:var(--text-primary);">${inc.sector}</td>
            <td>${inc.msg}</td>
            <td>
                <span style="padding:2px 6px; border-radius:2px; font-size:10px; font-weight:bold; background:${inc.severity === 'high' ? 'var(--status-critical-dim)' : 'var(--status-advisory-dim)'}; color:${inc.severity === 'high' ? 'var(--status-critical)' : 'var(--status-advisory)'};">
                    ${inc.severity.toUpperCase()}
                </span>
            </td>
            <td style="color:var(--text-muted);">${inc.disposition}</td>
        </tr>
    `).join("");
};

window.filterLogs = function (sev) {
    renderLogsTable(sev);
};

// Simulation of periodic operational surveillance log (every 18 seconds)
const realisticSurveillanceSweep = () => {
    if (!aiActive) return;

    const eventTemplates = [
        { msg: "EO/IR PERIMETER SCAN: NO BREACH DETECTED", sev: "nominal", sector: "MANESAR HQ (NCR)" },
        { msg: "VEHICLE NUMBER-PLATE VERIFIED (DEFENSE LOG)", sev: "nominal", sector: "MUMBAI HUB" },
        { msg: "UNIDENTIFIED MOTION AT PERIMETER FENCE (SECTOR 4)", sev: "medium", sector: "MANESAR HQ (NCR)" },
        { msg: "SATELLITE DOWNLINK TELEMETRY SYNCED", sev: "nominal", sector: "KOLKATA HUB" },
        { msg: "QRT READINESS TEST: 4-MINUTE DISPATCH VERIFIED", sev: "nominal", sector: "HYDERABAD HUB" }
    ];

    const pick = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    if (pick.sev === "medium") {
        addAlert(pick.msg, "medium", pick.sector);
        if (voiceActive) speak(`Advisory logged in ${pick.sector}.`);
    } else {
        addAlert(pick.msg, "nominal", pick.sector);
    }
};

window.simulateIncident = function () {
    const sectors = ["MANESAR HQ (NCR)", "MUMBAI HUB", "KOLKATA HUB", "CHENNAI HUB"];
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
    addAlert("CRITICAL: PERIMETER SECURITY CORDON TRIP DETECTED", "high", randomSector);
    triggerLockdown(randomSector, "UNAUTHORIZED PERIMETER BREACH");
};

window.resetAlerts = function () {
    total = 0;
    high = 0;
    medium = 0;
    incidents = [];
    saveData();
    updateUI();
    renderIncidentStreams();
    speak("Surveillance telemetry purged.");
};

/* ==========================================================================
   7. UI SYNCHRONIZATION & METRICS
   ========================================================================== */
const updateUI = () => {
    const elements = {
        "homeAlerts": total,
        "reportCount": total,
        "alertCountBadge": `${total} LOGS`,
        "highCount": high,
        "mediumCount": medium
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }

    // Threat Status Gauge on System Hub
    const threatStatus = document.getElementById("threat-status");
    const gaugeMeter = document.getElementById("gaugeMeter");
    const defconText = document.getElementById("threatConditionText");
    const defconPill = document.getElementById("defconPill");

    if (threatStatus) {
        if (high > 4) {
            threatStatus.innerText = "CONDITION: RED";
            threatStatus.style.color = "var(--status-critical)";
            if (gaugeMeter) {
                gaugeMeter.style.stroke = "var(--status-critical)";
                gaugeMeter.style.strokeDashoffset = "30";
            }
            if (defconText) defconText.innerText = "CONDITION: CRITICAL (DEFCON 2)";
            if (defconPill) defconPill.className = "defcon-pill critical";
        } else if (high > 1 || medium > 6) {
            threatStatus.innerText = "CONDITION: AMBER";
            threatStatus.style.color = "var(--status-advisory)";
            if (gaugeMeter) {
                gaugeMeter.style.stroke = "var(--status-advisory)";
                gaugeMeter.style.strokeDashoffset = "80";
            }
            if (defconText) defconText.innerText = "CONDITION: ELEVATED (DEFCON 3)";
            if (defconPill) defconPill.className = "defcon-pill elevated";
        } else {
            threatStatus.innerText = "CONDITION: GREEN";
            threatStatus.style.color = "var(--status-nominal)";
            if (gaugeMeter) {
                gaugeMeter.style.stroke = "var(--status-nominal)";
                gaugeMeter.style.strokeDashoffset = "140";
            }
            if (defconText) defconText.innerText = "CONDITION: NORMAL (DEFCON 4)";
            if (defconPill) defconPill.className = "defcon-pill";
        }
    }

    // Analytics Chart
    drawTacticalChart();
};

/* ==========================================================================
   8. TACTICAL ANALYTICS CHART (REPORTS.HTML)
   ========================================================================== */
const drawTacticalChart = () => {
    const canvas = document.getElementById("chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hubs = [
        { name: "NCR HQ", high: high, med: Math.ceil(medium * 0.4) },
        { name: "MUMBAI", high: 0, med: Math.ceil(medium * 0.25) },
        { name: "KOLKATA", high: 1, med: Math.ceil(medium * 0.15) },
        { name: "CHENNAI", high: 0, med: 1 },
        { name: "HYDERABAD", high: 0, med: 1 },
        { name: "GUJARAT", high: 0, med: 1 }
    ];

    const chartHeight = 150;
    const chartBaseY = 180;
    const barWidth = 24;
    const spacing = 84;
    const startX = 40;

    // Grid baseline
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX - 10, chartBaseY);
    ctx.lineTo(startX + (hubs.length * spacing), chartBaseY);
    ctx.stroke();

    hubs.forEach((hub, idx) => {
        const x = startX + (idx * spacing);

        const hH = Math.min(chartHeight, hub.high * 35);
        const mH = Math.min(chartHeight, hub.med * 20);

        // Critical Bar (Red)
        if (hH > 0) {
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(x, chartBaseY - hH, barWidth, hH);
        }

        // Elevated Bar (Amber)
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(x + barWidth + 4, chartBaseY - mH, barWidth, mH);

        // Label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(hub.name, x + barWidth, chartBaseY + 18);
    });

    // Legend
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(startX, 15, 12, 10);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px 'Rajdhani', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("CRITICAL ESCALATIONS", startX + 18, 24);

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(startX + 180, 15, 12, 10);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("ELEVATED ADVISORIES", startX + 198, 24);
};

/* ==========================================================================
   9. INITIALIZATION & LIVE CLOCKS
   ========================================================================== */
window.addEventListener('load', () => {
    updateUI();
    renderIncidentStreams();
    initTacticalMap();

    // Dual Clocks (IST and UTC Zulu)
    setInterval(() => {
        const clock = document.getElementById("hex-clock");
        const zulu = document.getElementById("zulu-clock");
        const sitrepDtg = document.getElementById("sitrep-dtg");
        const timestamps = document.querySelectorAll(".cam-timestamp");

        const now = new Date();
        const istStr = now.toLocaleTimeString('en-GB') + " IST";
        
        // Military Zulu Time DTG: DDHHMMZ MMM YY
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = months[now.getUTCMonth()];
        const year = String(now.getUTCFullYear()).slice(-2);

        const zuluStr = `${day}${hrs}${mins}${secs}Z ${month} ${year}`;

        if (clock) clock.innerText = istStr;
        if (zulu) zulu.innerText = zuluStr;
        if (sitrepDtg) sitrepDtg.innerText = `${day}${hrs}${mins}Z ${month} ${year}`;

        // Live camera millisecond timestamps
        const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
        timestamps.forEach(el => {
            el.innerText = `${now.toLocaleTimeString('en-GB')}.${ms}`;
        });
    }, 100);

    // AI Surveillance Protocol Button
    const aiBtn = document.getElementById('aiToggle');
    if (aiBtn) {
        aiBtn.addEventListener('click', function () {
            aiActive = !aiActive;
            this.classList.toggle('active');
            this.innerText = aiActive ? "AI SURVEILLANCE: ENGAGED" : "AI SURVEILLANCE: PAUSED";
            speak(aiActive ? "AI surveillance system engaged." : "AI surveillance suspended.");
        });
    }

    // Voice Toggle Button
    const voiceBtn = document.getElementById('voiceToggle');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function () {
            voiceActive = !voiceActive;
            this.classList.toggle('active');
            this.innerText = voiceActive ? "TACTICAL COMMS AUDIO: ON" : "TACTICAL COMMS AUDIO: OFF";
        });
    }

    // Periodic Realistic Surveillance Events
    setInterval(realisticSurveillanceSweep, 18000);
});
