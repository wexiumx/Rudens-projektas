"use strict";

const navigationBar = document.querySelector(".header-navigation-bar");
const navigationButton = document.querySelector(".nav-toggle");

if (navigationBar && navigationButton) {
    function setNavigationOpen(isOpen) {
        navigationBar.classList.toggle("is-open", isOpen);
        navigationButton.setAttribute("aria-expanded", String(isOpen));
        navigationButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        document.body.style.overflow = isOpen ? "hidden" : "";

    }

    navigationButton.addEventListener("click", () => {
        const isOpening = !navigationBar.classList.contains("is-open");
        setNavigationOpen(isOpening);
    });

    navigationBar.addEventListener("click", (event) => {
        if (event.target === navigationBar) {
            setNavigationOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setNavigationOpen(false);
        }
    });
}