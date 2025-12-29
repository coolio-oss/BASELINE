import { renderNavbar } from "./components/navbar.js";
import { renderProfile, setupProfile } from "./pages/profile.js";
import { store } from "./store.js";

// Daten laden
store.load();

const app = document.getElementById("app");
const navbarContainer = document.getElementById("navbar");

// Seite laden
function loadPage(page) {
    if (page === "profile") {
        app.innerHTML = renderProfile();
        setupProfile(); // Events binden
    }
}

// Navbar rendern
navbarContainer.appendChild(renderNavbar(loadPage));

// Startseite
loadPage("profile");
