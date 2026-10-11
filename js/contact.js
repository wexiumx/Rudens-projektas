"use strict";

document.querySelectorAll(".header-navigation-bar .nav-toggle").forEach((button) => {
    const navigationBar = button.closest(".header-navigation-bar");
    const navigation = navigationBar.querySelector("nav");
    const icon = button.querySelector("img");
    const menuIcon = icon.getAttribute("src");
    const closeIcon = menuIcon.replace("icon-hamburger.svg", "icon-close.svg");

    navigation.id = "primary-navigation";
    button.type = "button";
    button.setAttribute("aria-controls", navigation.id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation menu");

    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") !== "true";

        navigationBar.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        button.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} navigation menu`);
        icon.src = isOpen ? closeIcon : menuIcon;
        icon.alt = "";
    });
});
