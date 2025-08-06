console.log("script is runin...")

let songs = [];
let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;

// SVG icons
const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#1DB954"/><polygon points="200,150 380,256 200,362" fill="#000"/></svg>`;
const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#1DB954"/><rect x="180" y="150" width="60" height="212" fill="#000"/><rect x="272" y="150" width="60" height="212" fill="#000"/></svg>`;

// Fetch songs
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a") || element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
}

// Load a song
function loadSong(index) {
    audio.src = songs[index];
    document.getElementById("song-title").textContent = decodeURIComponent(songs[index].split("/").pop());
    audio.load();
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
}

// Format time
function formatTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Init player
async function init() {
    await getSongs();
    if (songs.length > 0) {
        loadSong(currentSongIndex);
    }

    // Initial icon
    document.getElementById("play").innerHTML = playSVG;

    // Event listeners
    document.getElementById("play").addEventListener("click", togglePlay);
    document.getElementById("next").addEventListener("click", nextSong);
    document.getElementById("prev").addEventListener("click", prevSong);

    // Play/Pause state change
    audio.addEventListener("play", () => {
        isPlaying = true;
        document.getElementById("play").innerHTML = pauseSVG;
    });

    audio.addEventListener("pause", () => {
        isPlaying = false;
        document.getElementById("play").innerHTML = playSVG;
    });

    // Update progress bar
    audio.addEventListener("timeupdate", () => {
        let progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById("seek-bar").value = progress || 0;
        document.getElementById("current-time").textContent = formatTime(audio.currentTime);
        document.getElementById("total-time").textContent = formatTime(audio.duration || 0);
    });

    // Seek
    document.getElementById("seek-bar").addEventListener("input", (e) => {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    });

    // Volume
    document.getElementById("volume-bar").addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });
}

init();




