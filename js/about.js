"use strict";

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".header-navigation-bar nav");
const navContact = document.querySelector(".nav-contact");

if (navToggle && siteNav) {
    const mobileNav = window.matchMedia("(max-width: 767px)");

    navToggle.type = "button";
    navToggle.setAttribute("aria-controls", "mobile-site-navigation");
    siteNav.id = "mobile-site-navigation";

    const setNavOpen = (isOpen, restoreFocus = false) => {
        const shouldOpen = isOpen && mobileNav.matches;

        document.body.classList.toggle("nav-open", shouldOpen);
        navToggle.setAttribute("aria-expanded", String(shouldOpen));
        navToggle.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
        siteNav.setAttribute("aria-hidden", String(!shouldOpen && mobileNav.matches));
        siteNav.inert = !shouldOpen && mobileNav.matches;

        if (navContact) {
            navContact.setAttribute("aria-hidden", String(!shouldOpen && mobileNav.matches));
            navContact.inert = !shouldOpen && mobileNav.matches;
        }

        if (restoreFocus) {
            navToggle.focus();
        }
    };

    setNavOpen(false);

    navToggle.addEventListener("click", () => {
        setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    siteNav.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setNavOpen(false);
        }
    });

    navContact?.addEventListener("click", () => {
        setNavOpen(false);
    });

    document.addEventListener("click", (event) => {
        if (
            document.body.classList.contains("nav-open") &&
            !siteNav.contains(event.target) &&
            !navToggle.contains(event.target) &&
            !navContact?.contains(event.target)
        ) {
            setNavOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
            setNavOpen(false, true);
        }
    });

    mobileNav.addEventListener("change", () => {
        setNavOpen(false);
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