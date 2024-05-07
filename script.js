// script.js

// Placeholder image URL
const placeholderImageURL = "Assets/placeholder.jpg";

// Function to generate a random gradient background
function generateRandomGradient() {
    const randomColor1 = Math.floor(Math.random() * 256);
    const randomColor2 = Math.floor(Math.random() * 256);
    const randomColor3 = Math.floor(Math.random() * 256);
    const randomColor4 = Math.floor(Math.random() * 256);
    return `linear-gradient(45deg, rgb(${randomColor1}, ${randomColor2}, ${randomColor3}), rgb(${randomColor4}, ${randomColor3}, ${randomColor2}))`;
}

// Function to update album image
function updateAlbumImage(imageURL) {
    const albumImage = document.getElementById("album-image");
    albumImage.src = imageURL;
}

// Function to update background gradient
function updateBackgroundGradient(color1, color2) {
    document.body.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
}

// Function to set a random gradient background on page load
function setRandomBackground() {
    const randomGradient = generateRandomGradient();
    document.body.style.background = randomGradient;
}

// Call setRandomBackground function on page load
setRandomBackground();

// Handle file input change event
document.getElementById("album-image-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateAlbumImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Handle drop event on album image
const albumImage = document.getElementById("album-image");
albumImage.addEventListener("dragover", function(event) {
    event.preventDefault(); // Prevent default behavior (open as link for some elements)
});
albumImage.addEventListener("drop", function(event) {
    event.preventDefault(); // Prevent default behavior (open as link for some elements)
    const file = event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateAlbumImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Watermark click event to change background gradient
const watermark = document.getElementById("watermark");
watermark.addEventListener("click", function() {
    const randomColor1 = Math.floor(Math.random() * 256);
    const randomColor2 = Math.floor(Math.random() * 256);
    const randomColor3 = Math.floor(Math.random() * 256);
    const randomColor4 = Math.floor(Math.random() * 256);
    document.body.style.background = `linear-gradient(45deg, rgb(${randomColor1}, ${randomColor2}, ${randomColor3}), rgb(${randomColor4}, ${randomColor3}, ${randomColor2}))`;
});

// Handle paste event on lyrics
const lyrics = document.getElementById("lyrics");
lyrics.addEventListener("paste", function(event) {
    // Prevent default paste behavior
    event.preventDefault();

    // Get pasted text from clipboard
    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

    // Insert plain text into the lyrics container
    document.execCommand("insertText", false, text);
});

// Disable spellcheck on lyrics container
lyrics.setAttribute("spellcheck", "false");

// Remove formatting when pasting into any text box
const textInputs = document.querySelectorAll("input[type='text'], textarea");
textInputs.forEach(input => {
    input.addEventListener("paste", function(event) {
        // Prevent default paste behavior
        event.preventDefault();

        // Get pasted text from clipboard
        const text = (event.originalEvent || event).clipboardData.getData('text/plain');

        // Insert plain text into the input field
        document.execCommand("insertText", false, text);
    });
});

// Function to toggle visibility of Test Grabber
function toggleTestGrabber() {
    const testGrabberContainer = document.getElementById("test-grabber-container");
    testGrabberContainer.style.display = testGrabberContainer.style.display === "none" ? "block" : "none";
}

// Handle click event on toggle icon
document.getElementById("toggle-test-grabber").addEventListener("click", function() {
    toggleTestGrabber();
    const toggleIcon = document.getElementById("toggle-test-grabber");
    toggleIcon.textContent = toggleIcon.textContent === "+" ? "-" : "+";
});

// Remove formatting when pasting into song name and artist name fields
const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");

songName.addEventListener("paste", function(event) {
    // Prevent default paste behavior
    event.preventDefault();

    // Get pasted text from clipboard
    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

    // Insert plain text into the song name field
    document.execCommand("insertText", false, text);
});

artistName.addEventListener("paste", function(event) {
    // Prevent default paste behavior
    event.preventDefault();

    // Get pasted text from clipboard
    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

    // Insert plain text into the artist name field
    document.execCommand("insertText", false, text);
});

// Handle test grabber button click event
document.getElementById("test-grabber").addEventListener("click", function() {
    let url = prompt("Enter URL:");
    if (url) {
        // Prepend http:// if URL doesn't include the protocol
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }
		
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Parse HTML response
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // Get meta tags
                const metaTags = doc.querySelectorAll("meta[property^='og:']");

                // Initialize variables for song name, artist name, and album art
                let songName = "Song Name";
                let artistName = "Artist Name";
                let albumArt = placeholderImageURL;

                // Iterate through meta tags to find relevant information
                metaTags.forEach(tag => {
                    const property = tag.getAttribute("property");
                    const content = tag.getAttribute("content");

                    if (property === "og:title") {
                        songName = content;
                    } else if (property === "og:description") {
                        // Remove anything after "·" if present
                        artistName = content.split("·")[0].trim();
                    } else if (property === "og:image") {
                        albumArt = content;
                    }
                });

                // Update UI with grabbed information
                updateAlbumImage(albumArt);
                document.getElementById("song-name").textContent = songName;
                document.getElementById("artist-name").textContent = artistName;
            })
            .catch(error => {
                console.error("Error fetching URL:", error);
                alert("Error fetching URL. Please try again.");
            });
    }
});