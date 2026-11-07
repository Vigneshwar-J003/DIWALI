
const params = new URLSearchParams(window.location.search);

const recipient = params.get("recipient") || "Friend";
const sender = params.get("sender") || "Someone special";
const relationship = params.get("relationship") || "Friend";

const heading = document.getElementById("recipientHeading");
const senderElement = document.getElementById("senderName");
const messageElement = document.getElementById("greetingMessage");

heading.textContent = `Dear ${recipient},`;
senderElement.textContent = sender;

const messages = {
    Father: "May this Diwali bring you good health, happiness and endless reasons to smile. Thank you for always being my strength.",
    Mother: "May your life always shine with happiness, love and peace. You make every moment brighter. Wishing you a beautiful Diwali!",
    Grandfather: "May your days be filled with health, peace and happiness. Your wisdom and love light up our family.",
    Grandmother: "May your heart always glow with happiness and your days be filled with beautiful moments and love.",
    Uncle: "Wishing you a Diwali filled with prosperity, good health and wonderful family moments.",
    Aunt: "May this festival bring you endless happiness, warmth and beautiful memories. Have a wonderful Diwali!",
    Brother: "May your life be full of success, adventure and happiness. Keep shining and making wonderful memories!",
    Sister: "May your smile shine brighter than every diya. Wishing you endless happiness, love and success!",
    Cousin: "May this Diwali bring new adventures, happiness and unforgettable memories. Keep shining!",
    Friend: "May our friendship shine brighter with every passing year. Wishing you happiness, success and unforgettable moments!",
    Teacher: "Wishing you a bright Diwali filled with peace, happiness and prosperity. Thank you for your guidance and inspiration!",
    Other: "May this festival of lights bring happiness, peace, prosperity and endless beautiful moments into your life."
};

messageElement.textContent =
    messages[relationship] || messages.Other;

const diyaArea = document.querySelector(".diya-area");
const diya = document.getElementById("diya");
const content = document.getElementById("greetingContent");
const tapHint = document.getElementById("tapHint");

let isLit = false;

function createSparkles(x, y, amount = 25) {
    const container = document.getElementById("particles");

    for (let i = 0; i < amount; i++) {
        const spark = document.createElement("span");

        spark.className = "spark";
        spark.textContent = ["✦", "✨", "·", "✧"][
            Math.floor(Math.random() * 4)
        ];

        spark.style.left = x + "px";
        spark.style.top = y + "px";
        spark.style.color = ["#ffcf70", "#fff1be", "#e99b38"][
            Math.floor(Math.random() * 3)
        ];

        spark.style.fontSize = (8 + Math.random() * 15) + "px";

        spark.style.setProperty(
            "--x",
            (Math.random() - 0.5) * 260 + "px"
        );

        spark.style.setProperty(
            "--y",
            (Math.random() - 0.5) * 260 + "px"
        );

        container.appendChild(spark);

        setTimeout(() => spark.remove(), 1300);
    }
}

function lightDiya() {
    if (isLit) return;

    isLit = true;

    diyaArea.classList.add("lit");
    tapHint.textContent = "LET THE CELEBRATION BEGIN";

    const rect = diya.getBoundingClientRect();

    createSparkles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        45
    );

    setTimeout(() => {
        content.classList.add("show");
    }, 900);
}

diya.addEventListener("click", lightDiya);

document.getElementById("celebrateButton")
    .addEventListener("click", () => {
        createSparkles(
            window.innerWidth / 2,
            window.innerHeight / 2,
            75
        );
    });

// Touch and click anywhere for magical sparkles.
document.addEventListener("pointerdown", event => {
    if (event.target.closest("button") || event.target === diya) {
        return;
    }

    createSparkles(event.clientX, event.clientY, 12);
});

// Sound is optional and starts only after the visitor enables it.
let audioContext = null;
let soundEnabled = false;

const soundButton = document.getElementById("soundButton");

function playBell() {
    if (!soundEnabled) return;

    if (!audioContext) {
        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.2
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.2);
}

soundButton.addEventListener("click", async () => {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
    }

    await audioContext.resume();

    soundEnabled = !soundEnabled;

    soundButton.textContent = soundEnabled
        ? "🔔 Sound On"
        : "🔇 Sound Off";

    if (soundEnabled) playBell();
});

// Update browser title for the recipient.
document.title = `Happy Diwali, ${recipient}!`;

/* ===== ADVANCED DIWALI ANIMATION ENGINE ===== */

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];
let animationRunning = false;

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create a firework explosion.

function launchFireworks(x, y) {
    const colors = [
        "#ffd166",
        "#ffae42",
        "#fff1bd",
        "#f5c16c",
        "#e9a4a4"
    ];

    const amount = 65;

    for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.009 + Math.random() * 0.014,
            size: 1 + Math.random() * 2.5,
            color: colors[
                Math.floor(Math.random() * colors.length)
            ]
        });
    }

    if (!animationRunning) {
        animationRunning = true;
        requestAnimationFrame(animateFireworks);
    }
}

function animateFireworks() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vy += 0.035;
        particle.vx *= 0.99;
        particle.life -= particle.decay;

        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    particles = particles.filter(particle => particle.life > 0);

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        animationRunning = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

// Create falling festive flower petals.

function releasePetals(amount = 30) {
    const container = document.getElementById("petals");

    for (let i = 0; i < amount; i++) {
        const petal = document.createElement("span");

        petal.className = "petal";

        const size = 7 + Math.random() * 10;

        petal.style.left = Math.random() * 100 + "vw";
        petal.style.width = size + "px";
        petal.style.height = size * 1.5 + "px";

        petal.style.animationDuration =
            (5 + Math.random() * 5) + "s";

        petal.style.animationDelay =
            (Math.random() * 2) + "s";

        petal.style.setProperty(
            "--drift",
            (Math.random() * 160 - 80) + "px"
        );

        petal.style.setProperty(
            "--rotation",
            (360 + Math.random() * 720) + "deg"
        );

        container.appendChild(petal);

        setTimeout(() => petal.remove(), 12000);
    }
}

// Diya lighting celebration.

diya.addEventListener("click", () => {
    const rect = diya.getBoundingClientRect();

    setTimeout(() => {
        launchFireworks(
            rect.left + rect.width / 2,
            rect.top + 10
        );

        releasePetals(20);
    }, 500);
});

// Grand celebration button.

document.getElementById("celebrateButton")
    .addEventListener("click", () => {

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight * 0.4;

        launchFireworks(centerX, centerY);

        setTimeout(() => {
            launchFireworks(
                window.innerWidth * 0.25,
                window.innerHeight * 0.3
            );
        }, 350);

        setTimeout(() => {
            launchFireworks(
                window.innerWidth * 0.75,
                window.innerHeight * 0.3
            );
        }, 700);

        releasePetals(45);
    });
