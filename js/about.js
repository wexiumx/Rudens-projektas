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

        if (isOpening) {
            const buttonPosition = navigationButton.getBoundingClientRect();
            navigationButton.style.left = `${buttonPosition.left}px`;
            navigationButton.style.top = `${buttonPosition.top}px`;
        } else {
            navigationButton.style.removeProperty("left");
            navigationButton.style.removeProperty("top");
        }

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

document.querySelectorAll(".director-card > button").forEach((button) => {
    const card = button.closest(".director-card");
    const details = card.querySelector(".director-details");
    const directorName = details.querySelector("h3").textContent.trim();

    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") !== "true";

        card.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        button.setAttribute("aria-label", `${isOpen ? "Hide" : "Show"} ${directorName} details`);
        details.setAttribute("aria-hidden", String(!isOpen));
    });
});