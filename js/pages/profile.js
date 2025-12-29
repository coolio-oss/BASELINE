import { store } from "../store.js";

export function renderProfile() {
    return `
    <div class="page profile-page">

      <!-- Profil oben -->
      <div class="profile-top">
        <div class="profile-pic-wrapper">
          <img id="profile-pic" src="${store.user.pic}" />
          <input type="file" id="upload-pic" hidden />
        </div>
        <div class="profile-level">
          <span>Level</span>
          <strong id="level">${store.user.level}</strong>
        </div>
      </div>

      <!-- Benutzername & Bio -->
      <div class="profile-main">
        <div class="name-bio">
          <div style="display:flex; align-items:center; gap:10px;">
            <input id="username" value="${store.user.username}" disabled />
            <button id="edit-name" class="edit-btn">✏️</button>
          </div>
          <textarea id="bio" disabled>${store.user.bio}</textarea>
        </div>
      </div>

      <!-- Datenkarten -->
      <div class="profile-data-cards">
        <div class="data-card">
          <span class="label">Name:</span>
          <input id="realname" value="${store.user.realname}" disabled />
          <button id="edit-realname" class="edit-btn">✏️</button>
        </div>
        <div class="data-card">
          <span class="label">Verein:</span>
          <input id="club" value="${store.user.club}" disabled />
          <button id="edit-club" class="edit-btn">✏️</button>
        </div>
        <div class="data-card">
          <span class="label">Leistungsklasse:</span>
          <input id="rating" value="${store.user.rating}" disabled />
          <button id="edit-rating" class="edit-btn">✏️</button>
        </div>
      </div>

      <!-- Neuer Post Button -->
      <div style="margin:30px 0;">
        <button id="open-post-modal" class="primary">+ Neuer Post</button>
      </div>

      <!-- Posts Bereich -->
      <div id="posts"></div>

      <!-- Post Modal -->
      <div id="post-modal" class="modal-overlay" style="display:none;">
        <div class="modal">
          <h3>Neuer Post</h3>
          <div class="post-type-btn">
            <button id="choose-score">Score</button>
            <button id="choose-image">Bild</button>
          </div>
          <div id="post-form"></div>
          <button class="secondary" id="close-modal">Abbrechen</button>
        </div>
      </div>

      <!-- Lösch-Modal -->
      <div id="delete-modal" class="modal-overlay" style="display:none;">
        <div class="modal">
          <h3>Post löschen?</h3>
          <p>Möchtest du diesen Post wirklich löschen?</p>
          <button class="primary" id="confirm-delete">Ja</button>
          <button class="secondary" id="cancel-delete">Abbrechen</button>
        </div>
      </div>

    </div>
  `;
}

export function setupProfile() {
    const profilePic = document.getElementById("profile-pic");
    const uploadPic = document.getElementById("upload-pic");
    const username = document.getElementById("username");
    const bio = document.getElementById("bio");
    const postsDiv = document.getElementById("posts");

    const realname = document.getElementById("realname");
    const club = document.getElementById("club");
    const rating = document.getElementById("rating");

    const modal = document.getElementById("post-modal");
    const postContainer = document.getElementById("post-form");

    const deleteModal = document.getElementById("delete-modal");
    let postToDelete = null;

    // Init Felder
    profilePic.src = store.user.pic;
    username.value = store.user.username;
    bio.value = store.user.bio;
    realname.value = store.user.realname;
    club.value = store.user.club;
    rating.value = store.user.rating;
    document.getElementById("level").innerText = store.user.level;

    // Profilbild ändern
    profilePic.onclick = () => uploadPic.click();
    uploadPic.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => {
            store.user.pic = ev.target.result;
            store.save();
            profilePic.src = store.user.pic;
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    // Benutzername & Bio editieren
    document.getElementById("edit-name").onclick = () => {
        username.disabled = !username.disabled;
        bio.disabled = !bio.disabled;
    };
    [username, bio].forEach(el => el.oninput = () => {
        store.user[el.id] = el.value;
        store.save();
    });

    // Datenkarten editieren
    document.getElementById("edit-realname").onclick = () => realname.disabled = !realname.disabled;
    document.getElementById("edit-club").onclick = () => club.disabled = !club.disabled;
    document.getElementById("edit-rating").onclick = () => rating.disabled = !rating.disabled;

    [realname, club, rating].forEach(el => el.oninput = () => {
        store.user[el.id] = el.value;
        store.save();
    });

    // Neuer Post Modal
    document.getElementById("open-post-modal").onclick = () => {
        modal.style.display = "flex";
        postContainer.innerHTML = "";
    };
    document.getElementById("close-modal").onclick = () => modal.style.display = "none";

    // Score Post
    document.getElementById("choose-score").onclick = () => {
        postContainer.innerHTML = `
      <input id="score-text" placeholder="z.B. 6:4 / 7:5" />
      <button class="primary" id="submit-score">Posten</button>
    `;
        document.getElementById("submit-score").onclick = () => {
            const text = document.getElementById("score-text").value;
            if (!text) return;
            store.addPost({ type: "score", text });
            modal.style.display = "none";
            renderPosts();
        };
    };

    // Bild Post
    document.getElementById("choose-image").onclick = () => {
        postContainer.innerHTML = `
      <input type="file" id="img" />
      <textarea id="img-text" placeholder="Beschreibung"></textarea>
      <button class="primary" id="submit-img">Posten</button>
    `;
        document.getElementById("submit-img").onclick = () => {
            const file = document.getElementById("img").files[0];
            const text = document.getElementById("img-text").value;
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                store.addPost({ type: "image", image: e.target.result, text });
                modal.style.display = "none";
                renderPosts();
            };
            reader.readAsDataURL(file);
        };
    };

    // Render Posts inkl. Löschen-Button
    function renderPosts() {
        postsDiv.innerHTML = "";
        store.posts.forEach((p, index) => {
            const div = document.createElement("div");
            div.className = "post-card";

            let content = "";
            if (p.type === "score") content = `<h3>🎾 ${p.text}</h3>`;
            else content = `<img src="${p.image}"><p>${p.text}</p>`;

            // Mülleimer-Button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "edit-btn";
            deleteBtn.innerText = "🗑️";
            deleteBtn.onclick = () => {
                postToDelete = index;
                deleteModal.style.display = "flex";
            };

            div.innerHTML = content;
            div.appendChild(deleteBtn);
            postsDiv.appendChild(div);
        });
    }

    // Delete Modal
    document.getElementById("confirm-delete").onclick = () => {
        if (postToDelete !== null) {
            store.deletePost(postToDelete);
            postToDelete = null;
            deleteModal.style.display = "none";
            renderPosts();
        }
    };
    document.getElementById("cancel-delete").onclick = () => {
        postToDelete = null;
        deleteModal.style.display = "none";
    };

    renderPosts();
}




