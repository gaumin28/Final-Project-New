const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const saveUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

document.addEventListener("DOMContentLoaded", () => {
  // Forget password page
  const inputForget = document.querySelector("#input-forget");
  const linkRequest = document.getElementById("link-request");
  if (inputForget && linkRequest) {
    inputForget.addEventListener("keydown", () => {
      linkRequest.classList.remove("cursor-not-allowed");
    });
  }

  // Signup page
  const signupForm = document.querySelector("#signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("nameSignUp").value;
      const email = document.getElementById("emailSignUp").value;
      const password = document.getElementById("passSignUp").value;
      const phone = document.getElementById("phoneSignUp").value;

      if (!email || !password) {
        alert("Email and password are required.");
        return;
      }

      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        alert("An account with this email already exists. Please login.");
        return;
      }

      const newUser = {
        name: name || email.split("@")[0],
        email,
        password,
        phone,
      };
      users.push(newUser);
      saveUsers(users);
      console.log(newUser);

      // auto-login after signup
      localStorage.setItem(
        "user",
        JSON.stringify({ name: newUser.name, email: newUser.email })
      );
      window.location.href = "./index.html";
    });
  }

  // Login page
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("emailLogin").value.trim();
      const password = document.getElementById("passLogin").value;

      // check stored users first
      const users = getUsers();
      const matched = users.find(
        (u) => u.email === username && u.password === password
      );

      // legacy fallback
      const legacy = username === "gaumin@gmail.com" && password === "1234";

      if (matched || legacy) {
        const name = matched ? matched.name : "gaumin";
        localStorage.setItem("user", JSON.stringify({ name, email: username }));

        // update auth areas in-place
        updateAuthAreas();
        // window.location.href = "./index.html";
        const back = localStorage.getItem("redirectTo") || document.referrer;
        if (back) location.assign(back);
        return;
      }
      alert("Invalid credentials");
    });
  }

  // authentication
  const updateAuthAreas = () => {
    // retrieve with correct key "user"
    const user = JSON.parse(localStorage.getItem("user") || "null");
    console.log("Current user:", user);

    document.querySelectorAll(".auth-area").forEach((el) => {
      if (user) {
        el.innerHTML = `
          <span class="px-3 py-1 text-pink-400 font-bold">Hello, ${user.name}</span>
          <button class="logoutBtn">Logout</button>
        `;
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("logoutBtn")) {
        console.log("Logout clicked");
        localStorage.removeItem("user");
        location.reload();
      }
    });
  };

  updateAuthAreas();

  // play music

  let currentAudio = null; // store the current playing audio
  let currentButton = null; // store the current play button

  const playButton = document.querySelectorAll(".play-music");
  playButton.forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();

      // if clicking the same button, toggle pause/play
      if (currentButton === el && currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play();
          el.setAttribute("src", "./IMG/pause-icon.png");
        } else {
          currentAudio.pause();
          el.setAttribute("src", "./IMG/pink-play.png");
        }
        return;
      }

      // stop previous audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // reset previous button icon
      if (currentButton) {
        currentButton.setAttribute("src", "./IMG/pink-play.png");
      }

      // create and play new audio
      currentAudio = new Audio("./Audio/audio.mp3");
      currentAudio.play().catch((err) => {
        console.error("Audio play failed:", err);
        alert("Could not play audio. Check file path.");
      });

      // update button and store reference
      el.setAttribute("src", "./IMG/pause-icon.png");
      currentButton = el;

      // auto-reset button when audio ends
      currentAudio.addEventListener("ended", () => {
        el.setAttribute("src", "./IMG/pink-play.png");
      });
    });
  });

  // repeat icon

  const repeatButton = document.getElementById("repeat-icon");
  if (repeatButton) {
    repeatButton.addEventListener("click", function () {
      repeatButton.classList.toggle("repeat-active");
      console.log("clicked");
    });
  }

  //heart icon
  const heartButton = document.getElementById("heart-icon");
  if (heartButton) {
    heartButton.addEventListener("click", function () {
      heartButton.classList.toggle("heart-active");
      console.log("clicked");
    });
  }

  //playing music on playlist
  const defaultAudio = new Audio("./Audio/audio.mp3");
  // const pauseOverlays = document.querySelectorAll(".pause-overlay");
  const musicImages = document.querySelectorAll(".music-playing");
  function clearActiveOverlays() {
    document
      .querySelectorAll(
        'img[src*="pause-icon.png"].active-playing, .pause-overlay.active-playing'
      )
      .forEach((o) => {
        o.classList.remove("active-playing");
        o.classList.add("hidden");
      });
  }
  musicImages.forEach(function (image) {
    image.addEventListener("click", function (event) {
      event.preventDefault();
      const container = image.closest(".relative") || image.parentElement;
      if (!container) return;

      // find overlay inside the same container
      const overlay = container.querySelector(
        '.pause-overlay, img[src*="pause-icon.png"]'
      );
      if (!overlay) return;

      const isActive = overlay.classList.contains("active-playing");

      if (isActive) {
        // currently active -> pause
        defaultAudio.pause();
        overlay.classList.remove("active-playing");
        overlay.classList.add("hidden");
        return;
      }

      defaultAudio.pause();
      defaultAudio.currentTime = 0;
      clearActiveOverlays();

      // play new audio and show this overlay
      defaultAudio.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
      overlay.classList.remove("hidden");
      overlay.classList.add("active-playing");
    });
  });

  // search music
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", function (event) {
      if (searchInput.value.trim().toLowerCase() === "eminem") {
        window.location.href = "./EminemPageResponsive.html";
      }
      console.log(searchInput.value);
    });
  }

  // Play all music
  const playAllBtn = document.getElementById("play-all-button");
  const playAllImg = document.getElementById("play-all");
  // console.log(playAll);
  let isPlayed = false;
  if (playAllBtn) {
    playAllBtn.addEventListener("click", function () {
      if (!isPlayed) {
        defaultAudio.play();
        playAllImg.setAttribute("src", "./IMG/pause-icon.png");
        isPlayed = true;
      } else {
        defaultAudio.pause();
        playAllImg.setAttribute("src", "./IMG/pink-play.png");
        isPlayed = false;
      }
    });
  }

  const heartFav = document.querySelectorAll(".fav-heart");
  if (heartFav) {
    heartFav.forEach(function (el) {
      el.addEventListener("click", function () {
        el.classList.toggle("repeat-active");
        console.log("clicked");
      });
    });
  }

  // sidebar
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  toggleBtn?.addEventListener("click", () => {
    if (!sidebar) return;
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("flex");
  });
});
