"use strict";

const menuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNavigation = document.querySelector(".mobile-navigation");
const navigationBackdrop = document.querySelector(".mobile-navigation-backdrop");
const closeButton = document.querySelector(".mobile-navigation-close");

function setNavigationOpen(isOpen) {
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
	mobileNavigation.setAttribute("aria-hidden", String(!isOpen));
	mobileNavigation.inert = !isOpen;
	mobileNavigation.classList.toggle("is-open", isOpen);
	navigationBackdrop.hidden = !isOpen;
}

menuToggle.addEventListener("click", () => {
	setNavigationOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

closeButton.addEventListener("click", () => setNavigationOpen(false));
navigationBackdrop.addEventListener("click", () => setNavigationOpen(false));
mobileNavigation.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => setNavigationOpen(false));
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
		setNavigationOpen(false);
		menuToggle.focus();
	}
});