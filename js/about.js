"use strict";

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