const levels = [...document.querySelectorAll(".level-panel")];
const player = document.getElementById("player");
const track = document.getElementById("sky-track");
const clouds = [...document.querySelectorAll(".cloud")];
const themeToggle = document.getElementById("theme-toggle");
const themeHint = document.querySelector(".theme-hint");
themeHint.classList.add("is-timed-out");
const animatedCards = document.querySelectorAll(
	".project-card, .experience-card, .achievement-grid li, .skill-card, .attribute-card"
);
animatedCards.forEach((card) => {
	const cardIndex = [...card.parentElement.children].indexOf(card);
	card.style.setProperty("--card-delay", `${Math.min(cardIndex * 55, 550)}ms`);
});
const cardObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting && entry.target.closest(".level-panel").classList.contains("is-active")) {
			entry.target.classList.add("is-visible");
		}
	});
}, { threshold: 0.12 });
animatedCards.forEach((card) => cardObserver.observe(card));

let activeLevel = -1;
let wheelDelta = 0;
let wheelTimeout;
let touchStartX = 0;
let jumpTimeout;
let waveTimeout;

themeToggle.addEventListener("click", () => {
	const isNight = document.documentElement.dataset.theme !== "night";
	document.documentElement.dataset.theme = isNight ? "night" : "day";
	themeToggle.setAttribute("aria-pressed", String(isNight));
	themeToggle.setAttribute("aria-label", isNight ? "Return to day mode" : "Enter night mode");
	themeHint.classList.remove("is-timed-out");
	themeHint.classList.add("is-dismissed");
	themeHint.setAttribute("aria-hidden", "true");
	document.querySelector('meta[name="theme-color"]').content = isNight ? "#101c32" : "#b7def0";
});

function setLevel(index) {
	const nextLevel = Math.min(Math.max(index, 0), levels.length - 1);
	if (nextLevel === activeLevel) return;

	activeLevel = nextLevel;
	levels.forEach((level, levelIndex) => {
		const isActive = levelIndex === activeLevel;
		level.classList.toggle("is-active", isActive);
		level.setAttribute("aria-hidden", String(!isActive));
		level.inert = !isActive;
		if (!isActive) {
			level.querySelectorAll(".is-visible").forEach((card) => card.classList.remove("is-visible"));
		}
	});

	track.style.setProperty("--scene-index", activeLevel);
	clouds.forEach((cloud, index) => {
		cloud.style.translate = `${activeLevel * (index ? -8 : -18)}px 0`;
	});
	player.classList.remove("is-moving");
	void player.offsetWidth;
	player.classList.add("is-moving");
	window.setTimeout(() => player.classList.remove("is-moving"), 400);
	levels[activeLevel].scrollTop = 0;
}

function moveLevel(direction) {
	setLevel(activeLevel + direction);
}

function jumpPlayer() {
	window.clearTimeout(jumpTimeout);
	window.clearTimeout(waveTimeout);
	player.classList.remove("is-jumping");
	player.classList.remove("is-waving");
	void player.offsetWidth;
	player.classList.add("is-jumping");
	player.classList.add("is-waving");
	jumpTimeout = window.setTimeout(() => player.classList.remove("is-jumping"), 480);
	waveTimeout = window.setTimeout(() => player.classList.remove("is-waving"), 1000);
}

player.addEventListener("click", jumpPlayer);

document.addEventListener("keydown", (event) => {
	const target = event.target;
	if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
	if (event.code === "Space" && (!(target instanceof HTMLElement) || !target.closest("button, a") || target === player)) {
		event.preventDefault();
		jumpPlayer();
		return;
	}

	if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
		event.preventDefault();
		moveLevel(1);
	} else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
		event.preventDefault();
		moveLevel(-1);
	} else if (event.key === "Home") {
		event.preventDefault();
		setLevel(0);
	} else if (event.key === "End") {
		event.preventDefault();
		setLevel(levels.length - 1);
	}
});

document.querySelector(".game-world").addEventListener("wheel", (event) => {
	const panel = event.target.closest(".level-panel");
	const canScrollPanel = panel && panel.classList.contains("is-active")
		&& panel.scrollHeight > panel.clientHeight
		&& ((event.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1)
			|| (event.deltaY < 0 && panel.scrollTop > 0));
	if (canScrollPanel && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;

	event.preventDefault();
	wheelDelta += event.deltaY || event.deltaX;
	window.clearTimeout(wheelTimeout);
	wheelTimeout = window.setTimeout(() => { wheelDelta = 0; }, 250);
	if (Math.abs(wheelDelta) >= 55) {
		moveLevel(wheelDelta > 0 ? 1 : -1);
		wheelDelta = 0;
	}
}, { passive: false });

document.querySelector(".game-world").addEventListener("touchstart", (event) => {
	if (event.touches.length === 1) {
		touchStartX = event.touches[0].clientX;
	}
}, { passive: true });

document.querySelector(".game-world").addEventListener("touchend", (event) => {
	if (!touchStartX || event.changedTouches.length !== 1) return;
	const distance = event.changedTouches[0].clientX - touchStartX;
	if (Math.abs(distance) > 65) moveLevel(distance < 0 ? 1 : -1);
	touchStartX = 0;
}, { passive: true });

setLevel(0);
