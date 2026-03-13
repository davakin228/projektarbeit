// Фотки для каждого года — прямые ссылки
const PHOTOS = {
  "Schule_1970": [
    "https://github.com/davakin228/FOTOS-/blob/main/1970(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1970(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1970(3).jpg?raw=true"
  ],
  "Schule_1980": [
    "https://github.com/davakin228/FOTOS-/blob/main/1980(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1980(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1980(3).jpg?raw=true"
  ],
  "Schule_1990": [
    "https://github.com/davakin228/FOTOS-/blob/main/1990(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1990(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/1990(3).jpg?raw=true"
  ],
  "Schule_2000": [
    "https://github.com/davakin228/FOTOS-/blob/main/2000(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/2000(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/2000(3).jpg?raw=true"
  ],
  "Schule_2010": [
    "https://github.com/davakin228/FOTOS-/blob/main/2010(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/2010(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/2010(3).jpg?raw=true"
  ],
  "Schule_heute": [
    "https://github.com/davakin228/FOTOS-/blob/main/jetzt(1).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/jetzt(2).jpg?raw=true",
    "https://github.com/davakin228/FOTOS-/blob/main/jetzt(3).jpg?raw=true"
  ]
};

function createPetal() {
  const petal = document.createElement('div');
  petal.className = "petal";
  const size = Math.random() * 12 + 6;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.left = (Math.random() * 110 - 5) + "%";
  petal.style.top = "-20px";
  petal.style.position = "absolute";
  document.getElementById("sakura-container").appendChild(petal);

  const startRotate = Math.random() * 360;
  const swayX = Math.random() * 150 - 75;
  const rotateEnd = startRotate + Math.random() * 540 - 270;
  const duration = Math.random() * 6000 + 7000;
  const delay = Math.random() * 4000;

  petal.animate([
    { transform: `translate(0px, 0px) rotate(${startRotate}deg)`, opacity: 0.8 },
    { transform: `translate(${swayX * 0.4}px, 30vh) rotate(${startRotate + 100}deg)`, opacity: 0.7, offset: 0.3 },
    { transform: `translate(${swayX * 0.7}px, 60vh) rotate(${startRotate + 220}deg)`, opacity: 0.5, offset: 0.6 },
    { transform: `translate(${swayX}px, 110vh) rotate(${rotateEnd}deg)`, opacity: 0 }
  ], { duration, delay, easing: "ease-in-out", fill: "forwards" });

  setTimeout(() => petal.remove(), duration + delay + 200);
}
setInterval(createPetal, 300);

// ── Popups ──
const points = document.querySelectorAll(".point");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const popupPhotos = document.getElementById("popup-photos");
const overlay = document.getElementById("overlay");
let activePoint = null;

points.forEach(point => {
  point.addEventListener("click", (e) => {
    e.stopPropagation();
    const title = point.getAttribute("data-title");
    const text = point.getAttribute("data-text");
    const pointId = point.id;

    if (activePoint === point) {
      popup.classList.remove("active");
      overlay.classList.remove("active");
      activePoint = null;
      return;
    }

    activePoint = point;
    popupTitle.textContent = title;
    popupText.textContent = text;

    // Вставляем фотки
    popupPhotos.innerHTML = "";
    const photos = PHOTOS[pointId] || [];
    photos.forEach(src => {
      const img = document.createElement("img");
      img.className = "popup-photo";
      img.src = src;
      img.alt = "";
      img.addEventListener("click", function(e) {
        e.stopPropagation();
        if (window.openLightbox) window.openLightbox(this.src);
      });
      popupPhotos.appendChild(img);
    });

    const rect = point.getBoundingClientRect();
    const margin = 10, gap = 12;
    const screenW = window.innerWidth, screenH = window.innerHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    popup.classList.add("active");
    overlay.classList.add("active");

    const popupW = popup.offsetWidth;
    const popupH = popup.offsetHeight;

    const positions = [
      { left: cx - popupW / 2, top: rect.top - popupH - gap },
      { left: cx - popupW / 2, top: rect.bottom + gap },
      { left: rect.right + gap, top: cy - popupH / 2 },
      { left: rect.left - popupW - gap, top: cy - popupH / 2 },
    ];

    function fitsInScreen({ left, top }) {
      return left >= margin && top >= margin &&
             left + popupW <= screenW - margin &&
             top + popupH <= screenH - margin;
    }

    let chosen = positions.find(fitsInScreen);
    if (!chosen) {
      chosen = positions.reduce((best, pos) => {
        const overflow = (p) =>
          Math.max(0, margin - p.left) + Math.max(0, margin - p.top) +
          Math.max(0, p.left + popupW - (screenW - margin)) +
          Math.max(0, p.top + popupH - (screenH - margin));
        return overflow(pos) < overflow(best) ? pos : best;
      });
    }

    chosen.left = Math.min(Math.max(chosen.left, margin), screenW - popupW - margin);
    chosen.top = Math.min(Math.max(chosen.top, margin), screenH - popupH - margin);
    popup.style.left = chosen.left + "px";
    popup.style.top = chosen.top + "px";
  });
});

overlay.addEventListener("click", () => {
  popup.classList.remove("active");
  overlay.classList.remove("active");
  activePoint = null;
});
