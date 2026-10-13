"use strict";

const contactForm = document.querySelector(".contact-form");
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
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setNavigationOpen(false);
        }
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(new FormData(contactForm))
            });

            if (response.ok) {
                contactForm.reset();
            }
        } catch (error) {
            console.error("Could not submit contact form:", error);
        } finally {
            submitButton.disabled = false;
        }
    });
}