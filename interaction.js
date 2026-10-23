const root = document.documentElement;
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navActions = document.querySelector(".nav-actions");
const themeToggle = document.querySelector(".theme-toggle");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll("[data-reveal]")];

body.classList.add("js-enabled");

function setMenuOpen(isOpen) {
	navActions.classList.toggle("is-open", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

menuToggle.addEventListener("click", () => {
	setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
	link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("resize", () => {
	if (window.matchMedia("(min-width: 701px)").matches) setMenuOpen(false);
});

themeToggle.addEventListener("click", () => {
	const isDark = root.dataset.theme !== "dark";
	root.dataset.theme = isDark ? "dark" : "light";
	themeToggle.setAttribute("aria-pressed", String(isDark));
	themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
});

document.querySelector(".current-year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	revealItems.forEach((item) => revealObserver.observe(item));

	const sectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				navLinks.forEach((link) => {
					if (link.hash === `#${entry.target.id}`) {
						link.setAttribute("aria-current", "location");
					} else {
						link.removeAttribute("aria-current");
					}
				});
			}
		});
	}, { rootMargin: "-20% 0px -65% 0px" });

	sections.forEach((section) => sectionObserver.observe(section));
} else {
	revealItems.forEach((item) => item.classList.add("is-visible"));
}