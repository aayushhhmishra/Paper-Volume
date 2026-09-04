// Paper Volume - JavaScript

console.log("Paper Volume is ready!");

// Explore Music
const exploreButton = document.querySelector("#exploreMusic");

if (exploreButton) {
    exploreButton.addEventListener("click", () => {
        window.location.href = "tracks.html";
    });
}


// Home Search
const searchForm = document.querySelector("#searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const search = document.querySelector("#searchInput").value.trim();

        if (!search) {
            alert("Please enter an artist or song name.");
            return;
        }

        alert(`You searched for: ${search}`);
    });
}


// Login
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Login will be connected to the backend later.");
    });
}


// Register
const registerForm = document.querySelector("#registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const password = document.querySelector("#register-password").value;
        const confirmPassword = document.querySelector("#confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Account registration will be connected to the backend later.");
    });
}


// Upload Music
const uploadForm = document.querySelector("#uploadForm");

if (uploadForm) {
    uploadForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const audioFile = document.querySelector("#audio").files[0];

        if (!audioFile) {
            alert("Please select an audio file.");
            return;
        }

        alert("Song selected successfully!");
    });
}


// Track Search
const trackSearchForm = document.querySelector("#trackSearchForm");

if (trackSearchForm) {
    trackSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const search = document
            .querySelector("#trackSearch")
            .value
            .toLowerCase()
            .trim();

        const tracks = document.querySelectorAll(".track-card");

        tracks.forEach((track) => {
            const data = track.dataset.search.toLowerCase();
            track.style.display = data.includes(search) ? "block" : "none";
        });
    });
}


// Like Buttons
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.innerText =
            button.innerText === "♡ Like"
                ? "♥ Liked"
                : "♡ Like";
    });
});


// Artist Profiles
const artistProfile = document.querySelector("#artistProfile");
const closeArtistProfile = document.querySelector("#closeArtistProfile");
const artistCards = document.querySelectorAll(".artist-profile-button");

const artistData = {
    one: {
        number: "01",
        name: "Artist One",
        genre: "Hip-Hop",
        bio: "Artist One is an independent hip-hop artist creating energetic and original music. Their sound combines modern production with raw independent energy.",
        tracks: "12",
        followers: "2.4K",
        songs: ["Midnight", "Lost Dreams", "No Limits"]
    },

    two: {
        number: "02",
        name: "Artist Two",
        genre: "R&B",
        bio: "Artist Two creates smooth R&B music with emotional melodies, modern production and a unique independent sound.",
        tracks: "9",
        followers: "1.8K",
        songs: ["After Hours", "Closer", "Blue Moon"]
    },

    three: {
        number: "03",
        name: "Artist Three",
        genre: "Lo-Fi",
        bio: "Artist Three creates chilled lo-fi music for late nights, quiet moments and everything in between.",
        tracks: "18",
        followers: "3.1K",
        songs: ["Rainy Nights", "Coffee", "Slow Days"]
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

        document.querySelector("#profileNumber").innerText = artist.number;
        document.querySelector("#profileName").innerText = artist.name;
        document.querySelector("#profileGenre").innerText = artist.genre;
        document.querySelector("#profileBio").innerText = artist.bio;
        document.querySelector("#profileTracks").innerText = artist.tracks;
        document.querySelector("#profileFollowers").innerText = artist.followers;

        const trackList = document.querySelector("#profileTrackList");
        trackList.innerHTML = "";

        artist.songs.forEach((song, index) => {
            const songElement = document.createElement("div");

            songElement.className = "profile-track";

            songElement.innerHTML = `
                <span class="track-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="track-name">
                    ${song}
                </span>

                <span class="track-play">
                    ▶
                </span>
            `;

            trackList.appendChild(songElement);
        });

        artistProfile.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});


if (closeArtistProfile) {
    closeArtistProfile.addEventListener("click", closeArtist);
}


// Track Profiles
const trackProfile = document.querySelector("#trackProfile");
const closeTrackProfile = document.querySelector("#closeTrackProfile");
const viewTrackButtons = document.querySelectorAll(
    ".view-track-button, .track-title"
);

const trackData = {
    "die-for-you": {
        number: "01",
        name: "Die For You",
        artist: "The Weeknd",
        genre: "Pop",
        likes: "12.4K",
        plays: "86K",
        release: "2026",
        audio: "Audio/die-for-you.mp3",
        lyrics: "Lyrics will appear here when properly licensed lyrics are added."
    },

    fein: {
        number: "02",
        name: "FE!N",
        artist: "Travis Scott",
        genre: "Hip-Hop",
        likes: "18.7K",
        plays: "124K",
        release: "2026",
        audio: "Audio/fe!n.mp3",
        lyrics: "Lyrics will appear here when properly licensed lyrics are added."
    },

    "big-dawgs": {
        number: "03",
        name: "Big Dawgs",
        artist: "Hanumankind",
        genre: "Hip-Hop",
        likes: "21.2K",
        plays: "156K",
        release: "2026",
        audio: "Audio/big-dawgs.mp3",
        lyrics: "Lyrics will appear here when properly licensed lyrics are added."
    }
};


function closeTrack() {
    if (!trackProfile) return;

    const audio = document.querySelector("#profileAudio");

    if (audio) {
        audio.pause();
    }

    trackProfile.classList.remove("active");
    document.body.style.overflow = "";
}


viewTrackButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const trackId =
            button.dataset.track ||
            button.closest(".track-card")?.dataset.track;

        const track = trackData[trackId];

        if (!track) return;

        document.querySelector("#profileTrackNumber").innerText = track.number;
        document.querySelector("#profileTrackName").innerText = track.name;
        document.querySelector("#profileTrackArtist").innerText = track.artist;
        document.querySelector("#profileTrackGenre").innerText = track.genre;
        document.querySelector("#profileTrackLikes").innerText = track.likes;
        document.querySelector("#profileTrackPlays").innerText = track.plays;
        document.querySelector("#profileTrackRelease").innerText = track.release;
        document.querySelector("#profileLyrics").innerText = track.lyrics;

        const audio = document.querySelector("#profileAudio");
        const source = document.querySelector("#profileAudioSource");

        audio.pause();
        source.src = track.audio;
        audio.load();

        trackProfile.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});


if (closeTrackProfile) {
    closeTrackProfile.addEventListener("click", closeTrack);
}


// Close profiles with Escape
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeArtist();
    closeTrack();
});