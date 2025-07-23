let me = Storage.getUser();
if (!me) location.href = "signin";
document.getElementById("currentUser").textContent = me;
document.getElementById("iconPreview").src = `${SERVER}/icons/${me}.jpg`;
let sortOrder = "desc";

// ✅ ダークモード初期化
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");

  if (savedTheme === "dark") {
    body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "Light Mode";
  } else {
    body.classList.remove("dark");
    if (themeBtn) themeBtn.textContent = "Dark Mode";
  }
});

function toggleTheme() {
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");
  const isDark = body.classList.toggle("dark");
  if (themeBtn) themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

document.getElementById("useThumbUpload").addEventListener("change", () => {
  const checked = document.getElementById("useThumbUpload").checked;
  document.getElementById("thumbInput").disabled = !checked;
  document.getElementById("thumbSize").disabled = !checked;
});

function setSortOrder(order) {
  sortOrder = order;
  renderVideos();
}

function toggleUploadLock() {
  document.getElementById("lockPassword").disabled = !document.getElementById("lockToggle").checked;
}

function toggleEditLock(id) {
  document.getElementById(`lockPassword-${id}`).disabled = !document.getElementById(`lockToggle-${id}`).checked;
}

function cropImage(file, width, height, callback) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      const ratio = Math.max(width / img.width, height / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      canvas.toBlob(callback, "image/jpeg");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function renderVideos() {
  fetch(`${SERVER}/videos/user/${me}`)
    .then(res => res.json())
    .then(videos => {
      videos.sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return sortOrder === "asc" ? ta - tb : tb - ta;
      });

      const list = videos.map(v => {
        const safeTitle = v.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `
          <div class="video-card">
            <img src="${SERVER}/thumbnails/${v.thumbnail || `${v.id}.jpg`}?t=${Date.now()}" width="200"><br>
            <div style="font-size: 16px; font-weight: bold;">
              ${safeTitle}
              ${v.password ? `<img src="img/lock.svg" alt="locked" class="lockIcon">` : ""}
            </div>
            <div class="video-info">
              ${new Date(v.date).toLocaleString("ja-JP", {
                year: "numeric", month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit"
              })}
            </div>
            <div class="video-actions">
              <a href="watch?id=${v.id}">watch</a>
              <button onclick="deleteVideo('${v.id}')">delete</button>
              <button onclick="showEdit('${v.id}', ${JSON.stringify(v.title)}, ${JSON.stringify(v.description ?? "")})">edit</button>
            </div>
            <div id="edit-${v.id}"></div>
          </div>
        `;
      }).join("");

      document.getElementById("list").innerHTML = list || "No videos yet.";
    });
}

function upload() {
  const title = document.getElementById("titleInput").value.trim();
  const file = document.getElementById("fileInput").files[0];
  const thumbChecked = document.getElementById("useThumbUpload").checked;
  const thumb = document.getElementById("thumbInput").files[0];
  const thumbSizeValue = document.getElementById("thumbSize").value;
  const [tw, th] = thumbSizeValue.split("x").map(Number);
  const description = document.getElementById("description").value.trim();
  const isLocked = document.getElementById("lockToggle").checked;
  const password = document.getElementById("lockPassword").value.trim();
  const status = document.getElementById("uploadStatus");

  if (!title || !file) return alert("Enter title and file.");
  if (file.size > 30 * 1024 * 1024) return alert("File too big.");
  if (thumbChecked && !thumb) return alert("Select a thumbnail image.");
  if (thumbChecked && thumb.size > 130 * 1024) return alert("Thumbnail too big.");
  if (isLocked && !password) return alert("Enter password.");

  status.innerHTML = `<span class="spinner"></span> Uploading...`;

  const form = new FormData();
  form.append("username", me);
  form.append("title", title);
  form.append("description", description);
  form.append("video", file);
  form.append("lockPassword", isLocked ? password : "");

  function submit(formData) {
    fetch(`${SERVER}/upload`, { method: "POST", body: formData })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        status.textContent = "✅ Upload successful.";
        renderVideos();
        resetForm();
      })
      .catch(() => {
        status.textContent = "❌ Upload failed.";
      });
  }

  function resetForm() {
    document.getElementById("titleInput").value = "";
    document.getElementById("fileInput").value = "";
    document.getElementById("thumbInput").value = "";
    document.getElementById("description").value = "";
    document.getElementById("lockToggle").checked = false;
    document.getElementById("lockPassword").value = "";
    document.getElementById("lockPassword").disabled = true;
    document.getElementById("useThumbUpload").checked = false;
    document.getElementById("thumbInput").disabled = true;
    document.getElementById("thumbSize").disabled = true;
    setTimeout(() => status.textContent = "", 3000);
  }

  if (thumbChecked) {
    cropImage(thumb, tw, th, blob => {
      form.append("thumbnail", blob, "thumb.jpg");
      submit(form);
    });
  } else {
    submit(form);
  }
}

function updateIcon() {
  const input = document.getElementById("iconInput");
  const file = input.files[0];
  const status = document.getElementById("iconStatus");
  if (!file) return alert("Select a .jpg image.");
  if (file.size > 30 * 1024) return alert("Icon too big.");

  status.innerHTML = `<span class="spinner"></span> Updating icon...`;

  cropImage(file, 600, 600, blob => {
    const form = new FormData();
    form.append("username", me);
    form.append("icon", blob, "icon.jpg");

    fetch(`${SERVER}/updateIcon`, {
      method: "POST",
      body: form
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        document.getElementById("iconPreview").src = `${SERVER}/icons/${me}.jpg?${Date.now()}`;
        input.value = "";
        status.textContent = "✅ Icon updated.";
      })
      .catch(() => status.textContent = "❌ Icon update failed.")
      .finally(() => setTimeout(() => status.textContent = "", 3000));
  });
}

function showEdit(id, title, description) {
  const container = document.getElementById(`edit-${id}`);
  container.innerHTML = `
    <p>Edit:</p>
    <p>title</p>
    <input id="title-${id}" value="${title}" style="width: 80%;"><br>
    <p>description</p>
    <textarea id="desc-${id}" rows="4" style="width: 80%;">${description}</textarea><br>
    <p>thumbnail</p>
    <input type="checkbox" id="useThumbEdit-${id}"> change thumbnail?<br>
    <input id="thumb-${id}" type="file" accept=".jpg" disabled><br>
    <p>lock</p>
    <input type="checkbox" id="lockToggle-${id}" onchange="toggleEditLock('${id}')"> lock this file<br>
    <input id="lockPassword-${id}" type="password" placeholder="password (if locked)" disabled><br>
    <button onclick="submitEdit('${id}')">save</button>
    <button onclick="cancelEdit('${id}')">cancel</button>
  `;
  document.getElementById(`useThumbEdit-${id}`).addEventListener("change", () => {
    document.getElementById(`thumb-${id}`).disabled = !document.getElementById(`useThumbEdit-${id}`).checked;
  });
}

function cancelEdit(id) {
  document.getElementById(`edit-${id}`).innerHTML = "";
}

function submitEdit(id) {
  const titleEl = document.getElementById(`title-${id}`);
  const descEl = document.getElementById(`desc-${id}`);
  const thumbEl = document.getElementById(`thumb-${id}`);
  const lockToggle = document.getElementById(`lockToggle-${id}`);
  const passEl = document.getElementById(`lockPassword-${id}`);

  const newTitle = titleEl.value.trim();
  const newDesc = descEl.value.trim();
  const thumbChecked = document.getElementById(`useThumbEdit-${id}`).checked;
  const newThumb = thumbEl.files[0];
  const isLocked = lockToggle.checked;
  const password = passEl.value.trim();

  if (thumbChecked && !newThumb) return alert("Select a thumbnail image.");
  if (thumbChecked && newThumb.size > 130 * 1024) return alert("Thumbnail too big.");
  if (isLocked && !password) return alert("Enter password.");

  const form = new FormData();
  form.append("title", newTitle);
  form.append("description", newDesc);
  form.append("lockPassword", isLocked ? password : "");

  function finishSend(blob) {
    if (blob) form.append("thumbnail", blob, "thumb.jpg");
    fetch(`${SERVER}/editVideo/${id}`, {
      method: "PATCH",
      body: form
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        renderVideos();
        cancelEdit(id);
      })
      .catch(() => alert("Failed to save edits."));
  }

  if (thumbChecked) {
    cropImage(newThumb, 640, 360, finishSend);
  } else {
    finishSend(null);
  }
}

function deleteVideo(id) {
  if (!confirm("Delete this video?")) return;
  fetch(`${SERVER}/deleteVideo/${id}`, { method: "DELETE" })
    .then(() => renderVideos());
}

function logout() {
  Storage.clearUser();
  location.href = "signin";
}

function removeAccount() {
  if (!confirm("Do you want to delete your account?")) return;
  fetch(`${SERVER}/deleteAccount`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: me })
  })
    .then(() => {
      Storage.clearUser();
      location.href = "signin";
    })
    .catch(() => alert("Failed to delete account."));
}

function changeAccount() {
  const now = document.getElementById("currentPassword").value.trim();
  const name = document.getElementById("newUsername").value.trim();
  const pass = document.getElementById("newPassword").value.trim();
  if (!now || !name || !pass) return alert("Enter all.");

  fetch(`${SERVER}/changeAccount`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      oldUsername: me,
      currentPassword: now,
      newUsername: name,
      newPassword: pass
    })
  })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      Storage.setUser(name);
      me = name;
      document.getElementById("currentUser").textContent = name;
      document.getElementById("iconPreview").src = `${SERVER}/icons/${name}.jpg?${Date.now()}`;
      renderVideos();
    })
    .catch(() => alert("Change failed"));
}

function copyUrl() {
  const element = document.createElement("input");
  element.value = `https://videos.bird.f5.si/user?name=${me}`;
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);
}

renderVideos();
