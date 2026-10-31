/* script.js */
// State Variables
let cycle = 1;
let oxygen = 90;
let virtue = 75; // Aristotle: High = Polis (Godlike virtue), Low = Beastliness
let order = 50;  // Hobbes: Absolute Sovereign Order vs. State of Nature Chaos
let population = 40;

const canvas = document.getElementById('colonyCanvas');
const ctx = canvas.getContext('2d');

// Initialize Citizen Objects for Canvas Graphics
let citizens = [];
for (let i = 0; i < 28; i++) {
    citizens.push({
        x: Math.random() * 360 + 100,
        y: Math.random() * 260 + 80,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6
    });
}

// Canvas Visual Rendering Loop
function drawColony() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Glass Habitat Dome
    ctx.strokeStyle = '#2d3b5e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(280, 210, 185, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Central Life Support Module
    ctx.fillStyle = oxygen > 40 ? '#1b4d3e' : '#661a1a';
    ctx.fillRect(245, 175, 70, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('LIFE SUPPORT', 248, 212);

    // 3. Aristotelian Solarium / Civic Center
    ctx.fillStyle = '#3a3219';
    ctx.fillRect(130, 110, 80, 50);
    ctx.fillStyle = '#ffcc00';
    ctx.fillText('SOLARIUM', 142, 138);

    // 4. Hobbesian Sovereign Bunker
    ctx.fillStyle = '#3a1a24';
    ctx.fillRect(350, 260, 85, 50);
    ctx.fillStyle = '#ff3366';
    ctx.fillText('COMMAND', 362, 288);

    // 5. Draw & Animate Citizens
    citizens.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;

        // Dome Collision Boundary
        let dist = Math.hypot(c.x - 280, c.y - 210);
        if (dist > 170) {
            c.vx *= -1;
            c.vy *= -1;
        }

        // Color coding: Green (Virtuous/Polis), Blue (Neutral), Red (Beastly/State of Nature)
        let color = virtue < 40 ? '#ff4d4d' : (virtue > 70 ? '#55ff55' : '#4da6ff');

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawColony);
}
drawColony();

// Logger Helper Function
function log(msg) {
    const consoleBox = document.getElementById('logConsole');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `[Cycle ${cycle}] ${msg}`;
    consoleBox.appendChild(entry);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// UI Refresh Function
function updateUI() {
    document.getElementById('val-oxygen').innerText = oxygen + '%';
    document.getElementById('bar-oxygen').style.width = oxygen + '%';

    let virtueState = virtue < 40 ? '(Beast State)' : (virtue > 75 ? '(Polis State)' : '(Neutral)');
    document.getElementById('val-virtue').innerText = `${virtue} / 100 ${virtueState}`;
    document.getElementById('bar-virtue').style.width = virtue + '%';

    document.getElementById('val-order').innerText = order + '%';
    document.getElementById('bar-order').style.width = order + '%';

    document.getElementById('val-pop').innerText = population;
    document.getElementById('cycle-counter').innerText = 'Cycle: ' + cycle;
}

// Political Policy Decrees
function enactAristotle() {
    virtue = Math.min(100, virtue + 15);
    oxygen = Math.max(0, oxygen - 4);
    log(`Constructed solarium hub. Citizens gather to enjoy the artificial <span class="keyword">apricity</span> of radiant heaters. <span class="theory">Aristotle: Community prevents bestial decay.</span>`);
    updateUI();
}

function enactHobbes() {
    order = Math.min(100, order + 20);
    virtue = Math.max(0, virtue - 10);
    log(`Enforced strict sovereign rationing. <span class="theory">Hobbes: Leviathan authority controls state of nature chaos.</span>`);
    updateUI();
}

function enactLocke() {
    virtue = Math.min(100, virtue + 8);
    order = Math.min(100, order + 5);
    log(`Granted individual property rights to hydroponic pods. <span class="theory">Locke: Labor earns ownership.</span>`);
    updateUI();
}

function enactDefenestration() {
    if (population > 5) {
        population -= 2;
        order = Math.min(100, order + 15);
        virtue = Math.max(0, virtue - 12);
        citizens.splice(0, 2);
        log(`Exiled convicted saboteurs via emergency airlock <span class="keyword">defenestration</span> into space vacuum! Order enforced through intimidation.`);
    } else {
        log(`Defenestration rejected: Population too low to sustain labor force.`);
    }
    updateUI();
}

// Cycle Progression Mechanic
function nextCycle() {
    cycle++;
    oxygen = Math.max(0, oxygen - 5);

    // Aristotelian Law: Low virtue causes citizens to become beastly
    if (virtue < 40) {
        order = Math.max(0, order - 12);
        log(`Low virtue! Citizens lack a polis, acting like bestial animals and sparking riots.`);
    }

    // Hobbesian Law: Low sovereign order triggers state of nature breakdown
    if (order < 30) {
        oxygen = Math.max(0, oxygen - 8);
        log(`State of Nature! Breakdown of order damages central life-support systems.`);
    }

    if (oxygen <= 0) {
        log(`<span class="keyword" style="color:red;">CRITICAL: Atmosphere depleted. Astraea Station failure.</span>`);
    }

    updateUI();
}