// Game Configuration Constants
const MAX_CYCLES = 20;

// Simulation State Variables
let cycle = 1;
let oxygen = 90;
let virtue = 75; // Aristotle: High = Polis (Virtuous), Low = Beastliness
let order = 50;  // Hobbes: Absolute Sovereign Order vs. State of Nature Chaos
let population = 40;
let isGameOver = false;

const canvas = document.getElementById('colonyCanvas');
const ctx = canvas.getContext('2d');

// Canvas Citizen Objects
let citizens = [];
function initCitizens() {
    citizens = [];
    for (let i = 0; i < 28; i++) {
        citizens.push({
            x: Math.random() * 360 + 100,
            y: Math.random() * 260 + 80,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6
        });
    }
}
initCitizens();

// Render Loop for Habitat Visuals
function drawColony() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Habitat Glass Dome
    ctx.strokeStyle = '#2d3b5e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(280, 210, 185, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Central Life Support Tower
    ctx.fillStyle = oxygen > 40 ? '#1b4d3e' : '#661a1a';
    ctx.fillRect(245, 175, 70, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('LIFE SUPPORT', 248, 212);

    // 3. Aristotelian Solarium Hub
    ctx.fillStyle = '#3a3219';
    ctx.fillRect(130, 110, 80, 50);
    ctx.fillStyle = '#ffcc00';
    ctx.fillText('SOLARIUM', 142, 138);

    // 4. Hobbesian Sovereign Citadel
    ctx.fillStyle = '#3a1a24';
    ctx.fillRect(350, 260, 85, 50);
    ctx.fillStyle = '#ff3366';
    ctx.fillText('COMMAND', 362, 288);

    // 5. Update & Render Citizens
    citizens.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;

        // Collision with Dome Wall
        let dist = Math.hypot(c.x - 280, c.y - 210);
        if (dist > 170) {
            c.vx *= -1;
            c.vy *= -1;
        }

        // Color Coding: Green (Virtuous/Polis), Blue (Neutral), Red (Beastly/State of Nature)
        let color = virtue < 40 ? '#ff4d4d' : (virtue > 70 ? '#55ff55' : '#4da6ff');

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawColony);
}
drawColony();

// Modal Functions
function openTutorial() {
    document.getElementById('tutorial-overlay').classList.remove('hidden');
}

function closeTutorial() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
}

// Logging System
function log(msg) {
    const consoleBox = document.getElementById('logConsole');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `[Cycle ${cycle}] ${msg}`;
    consoleBox.appendChild(entry);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// Refresh UI State
function updateUI() {
    document.getElementById('val-oxygen').innerText = oxygen + '%';
    document.getElementById('bar-oxygen').style.width = oxygen + '%';

    let virtueState = virtue < 40 ? '(Beast State)' : (virtue > 75 ? '(Polis State)' : '(Neutral)');
    document.getElementById('val-virtue').innerText = `${virtue} / 100 ${virtueState}`;
    document.getElementById('bar-virtue').style.width = virtue + '%';

    document.getElementById('val-order').innerText = order + '%';
    document.getElementById('bar-order').style.width = order + '%';

    document.getElementById('val-pop').innerText = population;
    document.getElementById('cycle-counter').innerText = `Cycle: ${cycle} / ${MAX_CYCLES}`;
}

// Executive Decrees
function enactAristotle() {
    if (isGameOver) return;
    virtue = Math.min(100, virtue + 15);
    oxygen = Math.max(0, oxygen - 4);
    log(`Constructed solarium hub. Citizens gather to enjoy the artificial <span class="keyword">apricity</span> of radiant heaters. <span class="theory">Aristotle: Community prevents bestial decay.</span>`);
    updateUI();
}

function enactHobbes() {
    if (isGameOver) return;
    order = Math.min(100, order + 20);
    virtue = Math.max(0, virtue - 10);
    log(`Enforced strict sovereign rationing. <span class="theory">Hobbes: Sovereign authority controls state of nature chaos.</span>`);
    updateUI();
}

function enactLocke() {
    if (isGameOver) return;
    virtue = Math.min(100, virtue + 8);
    order = Math.min(100, order + 5);
    log(`Granted individual property rights to hydroponic pods. <span class="theory">Locke: Labor earns ownership.</span>`);
    updateUI();
}

function enactDefenestration() {
    if (isGameOver) return;
    if (population > 5) {
        population -= 2;
        order = Math.min(100, order + 15);
        virtue = Math.max(0, virtue - 12);
        citizens.splice(0, 2);
        log(`Exiled convicted saboteurs via emergency airlock <span class="keyword">defenestration</span> into space vacuum! Order enforced through fear.`);
    } else {
        log(`Defenestration rejected: Population too low to sustain labor force.`);
    }
    updateUI();
}

// Cycle Loop Progression
function nextCycle() {
    if (isGameOver) return;

    cycle++;
    oxygen = Math.max(0, oxygen - 5);

    // Aristotelian Dynamic: Low virtue causes citizens to act bestially
    if (virtue < 40) {
        order = Math.max(0, order - 12);
        log(`Low virtue! Citizens lack a functioning polis, acting like bestial animals and sparking riots.`);
    }

    // Hobbesian Dynamic: Low order triggers state of nature breakdown
    if (order < 30) {
        oxygen = Math.max(0, oxygen - 8);
        log(`State of Nature! Breakdown of law and order damages central life-support systems.`);
    }

    updateUI();
    checkEndConditions();
}

// Win / Loss Condition Logic
function checkEndConditions() {
    const endOverlay = document.getElementById('end-overlay');
    const endTitle = document.getElementById('end-title');
    const endMsg = document.getElementById('end-message');

    if (oxygen <= 0) {
        isGameOver = true;
        endTitle.innerText = "CRITICAL FAILURE: Habitat Collapse";
        endTitle.style.color = "#ff4d4d";
        endMsg.innerHTML = "Atmosphere depleted. Without life support or sovereign order, Astraea Station descended into a Hobbesian State of Nature war of all against all.";
        endOverlay.classList.remove('hidden');
    } else if (cycle >= MAX_CYCLES) {
        isGameOver = true;
        endTitle.innerText = "MISSION SUCCESS: Commonwealth Established";
        endTitle.style.color = "#00e699";
        endMsg.innerHTML = `You successfully governed Astraea Station through 20 Cycles! Final Polis Index: <strong>${virtue}/100</strong> | Final Sovereign Order: <strong>${order}%</strong>.`;
        endOverlay.classList.remove('hidden');
    }
}

function restartGame() {
    cycle = 1;
    oxygen = 90;
    virtue = 75;
    order = 50;
    population = 40;
    isGameOver = false;

    initCitizens();
    document.getElementById('end-overlay').classList.add('hidden');
    document.getElementById('logConsole').innerHTML = '<div class="log-entry">[SYSTEM] Astraea Station reset. New simulation online.</div>';
    updateUI();
}