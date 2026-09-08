// Paper Volume - JavaScript

console.log("Paper Volume is ready!");

const $ = (selector) => document.querySelector(selector);


// ====================
// Explore Music
// ====================

const exploreButton = $("#exploreMusic");

if (exploreButton) {
    exploreButton.addEventListener("click", () => {
        window.location.href = "tracks.html";
    });
}

// ====================
// Home Search
// ====================

const searchForm = $("#searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const search = $("#searchInput").value.trim();

        if (!search) {
            alert("Please enter an artist or song name.");
            return;
        }

        window.location.href =
            "tracks.html?search=" + encodeURIComponent(search);
    });
}

// ====================
// Login
// ====================

const loginForm = $("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = $("#email").value.trim();
        const password = $("#password").value;

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Welcome back, " + data.user.name + "!");

                loginForm.reset();
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Could not connect to the server.");
        }
    });
}


// ====================
// Register
// ====================

const registerForm = $("#registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = $("#name").value.trim();
        const email = $("#register-email").value.trim();
        const password = $("#register-password").value;
        const confirmPassword = $("#confirm-password").value;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
                registerForm.reset();
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Could not connect to the server.");
        }
    });
}


// ====================
// Upload Music
// ====================

const uploadForm = $("#uploadForm");

if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (!loggedInUser) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const title = $("#songTitle").value.trim();
        const artist = $("#songArtist").value.trim();
        const genre = $("#songGenre").value.trim();
        const audioFile = $("#song").files[0];

        if (!title || !artist || !genre || !audioFile) {
            alert("Please provide all song details.");
            return;
        }

        if (audioFile.type !== "audio/mpeg") {
            alert("Please select a valid MP3 file.");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("genre", genre);
        formData.append("uploadedBy", loggedInUser.name);
        formData.append("song", audioFile);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Song uploaded successfully!");
                uploadForm.reset();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Could not connect to the server.");
        }
    });
}


// ====================
// Dynamic Tracks
// ====================

const trackContainer = $("#trackContainer");
let dynamicTracks = [];

async function loadTracks() {
    if (!trackContainer) return;

    try {
        const response = await fetch("/api/tracks");

        if (!response.ok) {
            throw new Error("Failed to fetch tracks");
        }

        const tracks = await response.json();
        dynamicTracks = tracks;
        trackContainer.innerHTML = "";

        if (tracks.length === 0) {
            trackContainer.innerHTML = "<p>No tracks available yet.</p>";
            return;
        }

        tracks.forEach((track, index) => {
            const trackCard = document.createElement("article");

            trackCard.className = "track-card";
            trackCard.dataset.track = track._id;
            trackCard.dataset.search =
                (track.title + " " + track.artist + " " + track.genre).toLowerCase();

            trackCard.innerHTML =
                '<div class="track-number">' +
                    String(index + 1).padStart(2, "0") +
                '</div>' +

                '<h3 class="track-title">' +
                    track.title +
                '</h3>' +

                '<p>' + track.artist + '</p>' +

                '<p>Genre: ' + track.genre + '</p>' +

                '<audio controls>' +
                    '<source src="/uploads/' +
                    encodeURIComponent(track.file) +
                    '" type="audio/mpeg">' +
                '</audio>' +

                '<div class="track-actions">' +
                    '<button class="like-button">♡ Like</button>' +

                    '<button class="view-track-button" data-track="' +
                    track._id +
                    '">View Track →</button>' +
                '</div>';

            trackContainer.appendChild(trackCard);
        });

        setupTrackButtons();
        setupLikeButtons();

    } catch (error) {
        console.log(error);
        trackContainer.innerHTML = "<p>Could not load tracks.</p>";
    }
}

loadTracks();


// ====================
// Track Search
// ====================

const trackSearchForm = $("#trackSearchForm");

if (trackSearchForm) {
    trackSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const search = $("#trackSearch").value.toLowerCase().trim();
        const tracks = document.querySelectorAll(".track-card");

        tracks.forEach((track) => {
            const data = track.dataset.search.toLowerCase();

            track.style.display =
                data.includes(search) ? "block" : "none";
        });
    });
}


// ====================
// Like Buttons
// ====================

function setupLikeButtons() {
    const likeButtons = document.querySelectorAll(".like-button");

    likeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            button.innerText =
                button.innerText === "♡ Like"
                    ? "♥ Liked"
                    : "♡ Like";
        });
    });
}


// ====================
// Artist Profiles
// ====================

const artistProfile = $("#artistProfile");
const closeArtistProfile = $("#closeArtistProfile");
const artistCards = document.querySelectorAll(".artist-profile-button");

const artistData = {
    one: {
        number: "01",
        name: "The Weeknd",
        country: "Canada",
        bio: "The Weeknd is a Canadian singer, songwriter, and record producer known for his dark, atmospheric sound blending R&B, pop, and hip-hop. With his distinctive voice and cinematic storytelling, he has become one of the biggest artists in modern music.",
        tracks: "300",
        followers: "1.1M",
        songs: ["Die For You", "Blinding Lights", "Timeless"]
    },

    two: {
        number: "02",
        name: "Travis Scott",
        country: "USA",
        bio: "Travis Scott is an American rapper, singer, and record producer known for his atmospheric sound, psychedelic production, and high-energy performances. He has shaped modern hip-hop with his unique style and albums like Rodeo, Astroworld, and Utopia.",
        tracks: "200",
        followers: "700K",
        songs: ["FE!N", "Sicko Mode", "You Know"]
    },

    three: {
        number: "03",
        name: "Hanumankind",
        country: "India",
        bio: "Hanumankind is an Indian rapper known for his powerful delivery, gritty sound, and unique blend of hip-hop with Indian influences. He gained global attention with his breakout track “Big Dawgs” and has become a rising name in Indian hip-hop.",
        tracks: "100",
        followers: "500K",
        songs: ["Big Dawgs", "Damnson", "Run It Up"]
    }
};

function closeArtist() {
    if (!artistProfile) return;

    artistProfile.classList.remove("active");
    document.body.style.overflow = "";
}

artistCards.forEach((card) => {
    card.addEventListener("click", () => {
        const artist = artistData[card.dataset.artist];

        if (!artist) return;

        $("#profileNumber").innerText = artist.number;
        $("#profileName").innerText = artist.name;
        $("#profileCountry").innerText = artist.country;
        $("#profileBio").innerText = artist.bio;
        $("#profileTracks").innerText = artist.tracks;
        $("#profileFollowers").innerText = artist.followers;

        const trackList = $("#profileTrackList");
        trackList.innerHTML = "";

        artist.songs.forEach((song, index) => {
            const songElement = document.createElement("div");

            songElement.className = "profile-track";

            songElement.innerHTML =
                '<span class="track-number">' +
                    String(index + 1).padStart(2, "0") +
                '</span>' +

                '<span class="track-name">' +
                    song +
                '</span>' +

                '<span class="track-play">▶</span>';

            trackList.appendChild(songElement);
        });

        artistProfile.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

if (closeArtistProfile) {
    closeArtistProfile.addEventListener("click", closeArtist);
}


// ====================
// Dynamic Track Profiles
// ====================

const trackProfile = $("#trackProfile");
const closeTrackProfile = $("#closeTrackProfile");

function setupTrackButtons() {
    const viewTrackButtons =
        document.querySelectorAll(".view-track-button, .track-title");

    viewTrackButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const trackId =
                button.dataset.track ||
                button.closest(".track-card")?.dataset.track;

            const track =
                dynamicTracks.find((item) => item._id === trackId);

            if (!track) return;

            $("#profileTrackNumber").innerText =
                String(dynamicTracks.indexOf(track) + 1).padStart(2, "0");

            $("#profileTrackName").innerText = track.title;
            $("#profileTrackArtist").innerText = track.artist;
            $("#profileTrackGenre").innerText = track.genre;
            $("#profileTrackLikes").innerText = "0";
            $("#profileTrackPlays").innerText = "0";

            $("#profileTrackRelease").innerText =
                new Date(track.createdAt).getFullYear();

            $("#profileLyrics").innerText =
                "Lyrics will appear here when properly licensed lyrics are added.";

            const audio = $("#profileAudio");
            const source = $("#profileAudioSource");

            if (audio && source) {
                audio.pause();
                source.src =
                    "/uploads/" + encodeURIComponent(track.file);
                audio.load();
            }

            if (trackProfile) {
                trackProfile.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });
}

function closeTrack() {
    if (!trackProfile) return;

    const audio = $("#profileAudio");

    if (audio) {
        audio.pause();
    }

    trackProfile.classList.remove("active");
    document.body.style.overflow = "";
}

if (closeTrackProfile) {
    closeTrackProfile.addEventListener("click", closeTrack);
}


// ====================
// Dashboard
// ====================

const dashboardName = $("#dashboardName");
const userName = $("#userName");
const userEmail = $("#userEmail");
const logoutButton = $("#logoutButton");

const loggedInUser =
    JSON.parse(localStorage.getItem("user"));

if (dashboardName && userName && userEmail) {
    if (!loggedInUser) {
        alert("Please login first.");
        window.location.href = "login.html";
    } else {
        dashboardName.innerText = loggedInUser.name;
        userName.innerText = loggedInUser.name;
        userEmail.innerText = loggedInUser.email;
    }
}


// ====================
// Dashboard Logout
// ====================

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");

        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}


// ====================
// Update Navbar
// ====================

const nav = document.querySelector("nav");

if (nav && loggedInUser) {
    nav.innerHTML =
        '<a href="index.html">Home</a> | ' +
        '<a href="artists.html">Artists</a> | ' +
        '<a href="tracks.html">Tracks</a> | ' +
        '<a href="upload.html">Upload</a> | ' +
        '<a href="dashboard.html">Dashboard</a> | ' +
        '<a href="#" id="navLogout">Logout</a>';

    const navLogout = $("#navLogout");

    navLogout.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem("user");

        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}


// ====================
// Close Profiles with Escape
// ====================

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeArtist();
        closeTrack();
    }
});