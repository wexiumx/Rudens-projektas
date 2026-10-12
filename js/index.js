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

    navigationButton.addEventListener("click", function () {
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

    navigationBar.addEventListener("click", function (event) {
        if (event.target === navigationBar) {
            setNavigationOpen(false);
            navigationButton.style.removeProperty("left");
            navigationButton.style.removeProperty("top");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setNavigationOpen(false);
            navigationButton.style.removeProperty("left");
            navigationButton.style.removeProperty("top");
        }
    });
}