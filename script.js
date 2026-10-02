const canvas = document.getElementById("loaderCanvas");
const ctx = canvas.getContext("2d");

let w, h;
let animationFrame;
let timer = 0;
let phase = 0;
let particles = [];

const DPR = Math.min(window.devicePixelRatio || 1, 2);

function createRing(cx, cy, number) {
    return Array.from({ length: number }, (_, i) => {
        const seg = (i / number) * 6;
        const side = Math.floor(seg);
        const f = seg - side;

        const R = Math.min(w, h) * 0.28;

        const a1 = (side / 6) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((side + 1) / 6) * Math.PI * 2 - Math.PI / 2;

        const x1 = cx + Math.cos(a1) * R;
        const y1 = cy + Math.sin(a1) * R;

        const x2 = cx + Math.cos(a2) * R;
        const y2 = cy + Math.sin(a2) * R;

        return {
            x: x1 + (x2 - x1) * f,
            y: y1 + (y2 - y1) * f
        };
    });
}

function resize() {
    const rect = canvas.getBoundingClientRect();

    w = rect.width;
    h = rect.height;

    canvas.width = w * DPR;
    canvas.height = h * DPR;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const targets = createRing(w / 2, h / 2, 84);

    particles = targets.map(target => ({
        x: Math.random() * w,
        y: Math.random() * h,
        tx: target.x,
        ty: target.y,
        hue: 190 + Math.random() * 70
    }));
}

function animate() {

    timer++;

    if (timer > 120) {

        timer = 0;
        phase ^= 1;

        if (phase) {

            particles.forEach(p => {
                p.tx = Math.random() * w;
                p.ty = Math.random() * h;
            });

        } else {

            const targets = createRing(
                w / 2,
                h / 2,
                particles.length
            );

            particles.forEach((p, i) => {
                p.tx = targets[i].x;
                p.ty = targets[i].y;
            });
        }
    }

    ctx.fillStyle = "rgba(6, 9, 18, 0.25)";
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < particles.length; i++) {

        const a = particles[i];

        a.x += (a.tx - a.x) * 0.08;
        a.y += (a.ty - a.y) * 0.08;

        for (let j = i + 1; j < particles.length; j++) {

            const b = particles[j];

            const distance = Math.hypot(
                a.x - b.x,
                a.y - b.y
            );

            if (distance < 48) {

                ctx.strokeStyle =
                    `hsla(210, 90%, 65%, ${(1 - distance / 48) * 0.4})`;

                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    for (const p of particles) {

        const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            6
        );

        gradient.addColorStop(
            0,
            `hsla(${p.hue}, 95%, 70%, 0.9)`
        );

        gradient.addColorStop(
            1,
            `hsla(${p.hue}, 95%, 70%, 0)`
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    animationFrame = requestAnimationFrame(animate);
}

resize();
animate();

window.addEventListener("resize", resize);


/* Ocultar loader después de 4 segundos */

setTimeout(() => {

    const loader = document.getElementById("loader");

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 800);

}, 4000);

const pantalla = document.getElementById("pantalla-secciones");
const contenido = document.getElementById("contenido-secciones");

const botones = document.querySelectorAll("#pantalla-secciones a");

botones.forEach(boton => {
    boton.addEventListener("click", function(event) {
        event.preventDefault();

        pantalla.style.display = "none";
        contenido.style.display = "block";
    });
});