/**
 * NSG TACTICAL COMMAND ENGINE v9.0.2
 * Core Intelligence & Neural Sync
 */

/* --- 1. DATA PERSISTENCE --- */
let total = parseInt(localStorage.getItem("total")) || 0;
let high = parseInt(localStorage.getItem("high")) || 0;
let medium = parseInt(localStorage.getItem("medium")) || 0;
let aiActive = true;

const saveData = () => {
    localStorage.setItem("total", total);
    localStorage.setItem("high", high);
    localStorage.setItem("medium", medium);
};

/* --- 2. VOCAL NOTIFICATION SYSTEM --- */
const speak = (msg) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(msg);
        speech.rate = 0.85;
        speech.pitch = 0.1; // Deep tactical voice
        window.speechSynthesis.speak(speech);
    }
};

/* --- 3. EMERGENCY PROTOCOLS --- */
const triggerLockdown = (zone) => {
    const body = document.getElementById('main-body');
    const popup = document.getElementById('emergency-popup');
    const status = document.getElementById('threat-status');
    
    if (body) body.classList.add('emergency-mode');
    if (popup) popup.style.display = 'flex';
    if (status) {
        status.innerText = "CONDITION: RED";
        status.className = "status-critical";
    }
    
    speak(`CRITICAL ALERT. WEAPON DETECTED IN ${zone}. INITIATING AUTO RESPONSE.`);
    aiActive = false;
};

window.dismissEmergency = function() {
    const body = document.getElementById('main-body');
    const popup = document.getElementById('emergency-popup');
    const status = document.getElementById('threat-status');
    
    if (body) body.classList.remove('emergency-mode');
    if (popup) popup.style.display = 'none';
    if (status) {
        status.innerText = "CONDITION: GREEN";
        status.className = "status-safe";
    }
    
    aiActive = true;
    speak("System Override Accepted. Resuming surveillance.");
};

/* --- 4. TACTICAL HUD UPDATES --- */
const updateMap = (zone) => {
    const dot = document.getElementById('map-dot');
    const locText = document.getElementById('location-text');
    if (dot) {
        dot.style.display = 'block';
        dot.style.top = Math.random() * 70 + 15 + "%";
        dot.style.left = Math.random() * 70 + 15 + "%";
    }
    if (locText) locText.innerText = "ZONE: " + zone;
};

const addToTimeline = (msg, type) => {
    const timeline = document.getElementById('timeline');
    const logs = document.getElementById('logs');
    if (!timeline && !logs) return;
    
    const time = new Date().toLocaleTimeString('en-GB');
    const color = type === "high" ? "#ff003c" : "#00ff41";
    const entry = `<div class="log-entry" style="color:${color}; border-left: 2px solid ${color}; padding-left:10px; margin-bottom:10px;">
                    <span style="opacity:0.5;">[${time}]</span> ${msg}
                   </div>`;
    
    if (timeline) {
        timeline.innerHTML = entry + timeline.innerHTML;
        if (timeline.children.length > 8) timeline.lastElementChild.remove();
    }
    if (logs) {
        logs.innerHTML = entry + logs.innerHTML;
    }
};

/* --- 5. AI DETECTION ENGINE --- */
const addAlert = (msg, type, zone = "INTERNAL") => {
    total++;
    type === "high" ? high++ : medium++;
    saveData();
    updateUI();

    const alertBox = document.getElementById("alerts");
    if (alertBox) {
        const time = new Date().toLocaleTimeString();
        const html = `<div class="alert-item" style="background:rgba(255,0,0,0.1); border:1px solid ${type==='high'?'#ff003c':'#ffaa00'}; padding:8px; margin-bottom:5px; font-size:10px;">
                        <span style="color:red">●</span> ${time} - ${msg}
                      </div>`;
        alertBox.innerHTML = html + alertBox.innerHTML;
    }
    addToTimeline(`${msg} @ ${zone}`, type);
};

const autoDetect = () => {
    if (!aiActive) return;

    const zones = ["SECTOR-7", "NORTH-GATE", "ARMORY-B", "LAB-04"];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const r = Math.random();

    if (r < 0.10) { 
        addAlert("CRITICAL: WEAPON DETECTED", "high", zone);
        updateMap(zone);
        triggerLockdown(zone);
    } else if (r < 0.40) {
        addAlert("SUSPICIOUS ACTIVITY", "medium", zone);
        updateMap(zone);
        speak("Alert. Movement in " + zone);
    }
};

/* --- 6. VISUALIZATION & UI SYNC --- */
const updateUI = () => {
    // Sync all counter IDs across different pages
    const elements = {
        "homeAlerts": total, "reportCount": total, "alertCount": total,
        "highCount": high, "mediumCount": medium
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }

    // Intelligence Insights
    const topThreat = document.getElementById("topThreat");
    const behavior = document.getElementById("behavior");
    const riskLevel = document.getElementById("riskLevel");

    if (topThreat) topThreat.innerText = high > medium ? "ARMED INTRUSION" : "UNAUTHORIZED ACCESS";
    if (behavior) behavior.innerText = total > 20 ? "HOSTILE PATTERN" : "STABLE";
    
    if (riskLevel) {
        riskLevel.innerText = high > 5 ? "CRITICAL" : (high > 1 ? "ELEVATED" : "MINIMAL");
        riskLevel.style.color = high > 5 ? "#ff003c" : (high > 1 ? "#ffaa00" : "#00ff41");
    }

    drawChartAnimated();
};

const drawChartAnimated = () => {
    const canvas = document.getElementById("chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const max = Math.max(high, medium, 1);
    const hBar = (high / max) * 150;
    const mBar = (medium / max) * 150;

    // Tactical Bars
    ctx.fillStyle = "#ff003c"; 
    ctx.fillRect(100, 200 - hBar, 60, hBar);
    ctx.strokeStyle = "#fff"; ctx.strokeRect(100, 200 - hBar, 60, hBar);

    ctx.fillStyle = "#ffaa00"; 
    ctx.fillRect(250, 200 - mBar, 60, mBar);
    ctx.strokeStyle = "#fff"; ctx.strokeRect(250, 200 - mBar, 60, mBar);

    ctx.fillStyle = "#00d2ff";
    ctx.font = "12px Orbitron";
    ctx.fillText("CRITICAL", 100, 220);
    ctx.fillText("ELEVATED", 250, 220);
};

/* --- 7. INITIALIZATION & CLOCK --- */
window.onload = () => {
    updateUI();
    setInterval(autoDetect, 6000);

    // Dynamic Clock
    setInterval(() => {
        const clock = document.getElementById("hex-clock");
        const dateEl = document.getElementById("hex-date");
        const now = new Date();
        if (clock) clock.innerText = now.toLocaleTimeString('en-GB');
        if (dateEl) dateEl.innerText = now.toLocaleDateString('en-GB').replace(/\//g, '.');
    }, 1000);

    // AI Toggle Handler
    const aiBtn = document.getElementById('aiToggle');
    if (aiBtn) {
        aiBtn.addEventListener('click', function() {
            aiActive = !aiActive;
            this.classList.toggle('active');
            this.innerText = aiActive ? "AI PROTOCOL: ON" : "AI PROTOCOL: OFF";
            speak(aiActive ? "AI systems online." : "AI systems suspended.");
        });
    }

    // Scanner Canvas Animation (CAM 04)
    const scanner = document.getElementById('scannerCanvas');
    if (scanner) {
        const sCtx = scanner.getContext('2d');
        setInterval(() => {
            sCtx.clearRect(0, 0, scanner.width, scanner.height);
            sCtx.strokeStyle = "#00ff41";
            sCtx.lineWidth = 2;
            let y = Math.random() * scanner.height;
            sCtx.beginPath();
            sCtx.moveTo(0, y); sCtx.lineTo(scanner.width, y);
            sCtx.stroke();
        }, 100);
    }
};

window.resetAlerts = function() {
    total = 0; high = 0; medium = 0;
    saveData();
    updateUI();
    const containers = ["alerts", "timeline", "logs"];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
    });
    speak("Intelligence database purged.");
};

/* --- FEATURE 2: BIOMETRIC PROFILING --- */
const targetNames = ["SGT. RAINA", "COL. VERMA", "UNKNOWN", "ASSET_77", "OFFICER K"];
const threatLevels = ["MINIMAL", "NEUTRAL", "ELEVATED", "CLEAR"];

function runBiometricCycle() {
    const card = document.getElementById('bio-id-card');
    if (!card) return;

    // Toggle card visibility randomly
    if (Math.random() > 0.5) {
        card.style.display = 'block';
        const name = targetNames[Math.floor(Math.random() * targetNames.length)];
        const threat = threatLevels[Math.floor(Math.random() * threatLevels.length)];
        
        document.getElementById('target-name').innerText = name;
        document.getElementById('target-status').innerText = "THREAT: " + threat;
        document.getElementById('match-bar').style.width = Math.floor(Math.random() * 100) + "%";

        // Highlight if "UNKNOWN" or "ELEVATED"
        if (name === "UNKNOWN" || threat === "ELEVATED") {
            document.getElementById('target-status').style.color = "red";
            card.style.borderColor = "red";
        } else {
            document.getElementById('target-status').style.color = "var(--neon-green)";
            card.style.borderColor = "var(--neon-blue)";
        }
    } else {
        card.style.display = 'none';
    }
}

/* --- FEATURE 3: VOICE COMMANDS --- */
function initVoiceControl() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.log("Voice Recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("AI Listening:", transcript);

        if (transcript.includes("lockdown") || transcript.includes("emergency") || transcript.includes("threat")) {
            triggerLockdown("VOICE ACTIVATED PROTOCOL");
        }
        
        if (transcript.includes("override") || transcript.includes("clear system") || transcript.includes("reset")) {
            dismissEmergency();
            resetAlerts();
        }

        if (transcript.includes("status report")) {
            speak(`Current system status is active. We have recorded ${total} total alerts.`);
        }
    };

    recognition.onend = () => recognition.start(); // Keep it always listening
    recognition.start();
}

// Update your window.onload to include these:
window.addEventListener('load', () => {
    initVoiceControl();
    setInterval(runBiometricCycle, 4000); // New profile every 4 seconds
});
/* --- FEATURE 4 & 5: INTELLIGENCE UPDATES --- */

function updatePredictiveEngine() {
    const probBar = document.getElementById('prob-bar');
    const intentTag = document.getElementById('intent-tag');
    if (!probBar) return;

    const val = Math.floor(Math.random() * (100 - 85) + 85); // Stays between 85-100%
    probBar.innerText = `STABLE: ${val}%`;

    // Randomly trigger a "Nervous" state
    if (val < 90) {
        intentTag.innerText = "INTENT: SUSPICIOUS";
        intentTag.style.color = "orange";
        probBar.style.color = "orange";
    } else {
        intentTag.innerText = "INTENT: NEUTRAL";
        intentTag.style.color = "var(--neon-green)";
        probBar.style.color = "var(--neon-blue)";
    }
}

function createMapPing() {
    const map = document.getElementById('map');
    if (!map) return;

    const ping = document.createElement('div');
    ping.className = 'signal-ping';
    ping.style.top = Math.random() * 80 + 10 + "%";
    ping.style.left = Math.random() * 80 + 10 + "%";
    
    map.appendChild(ping);
    setTimeout(() => ping.remove(), 2000);
}

// Add to your window.onload
window.addEventListener('load', () => {
    // Add radar beam to map
    const map = document.getElementById('map');
    if(map) {
        const beam = document.createElement('div');
        beam.className = 'radar-beam';
        map.appendChild(beam);
    }

    setInterval(updatePredictiveEngine, 2500);
    setInterval(createMapPing, 3000);
});