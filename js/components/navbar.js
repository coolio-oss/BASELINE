export function renderNavbar(onPageChange) {
    const nav = document.createElement("nav");
    nav.className = "navbar";
    nav.innerHTML = `
    <h1 class="logo">BASELINE</h1>
    <div class="nav-links">
      <button data-page="foryou">For You</button>
      <button data-page="play">Spielen</button>
      <button data-page="search">Suchen</button>
      <button data-page="profile">Profil</button>
    </div>
  `;

    nav.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => onPageChange(btn.dataset.page));
    });

    return nav;
}

