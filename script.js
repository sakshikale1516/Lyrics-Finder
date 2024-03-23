const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

// API URL
const apiURL = "https://api.lyrics.ovh";

// Listen to form submit event
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchValue = search.value.trim();

  if (!searchValue) {
    alert("Please enter an artist name or song lyrics.");
    return;
  }

  try {
    const data = await searchSong(searchValue);
    showData(data);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while searching. Please try again later.");
  }
});

// Search song function
async function searchSong(searchValue) {
  const response = await fetch(`${apiURL}/suggest/${searchValue}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

// Display search results
function showData(data) {
  result.innerHTML = `
    <div class="song-list">
      ${data.data
        .map(
          (song) => `
            <div class="song-info">
              <div class="artist-info">
                <div class="artist-image">
                  <img src="${song.artist.picture_medium}" alt="${song.artist.name}" />
                </div>
                <div class="artist-details">
                  <span class="song-name">${song.title}</span>
                  <span>${song.artist.name}</span>
                </div>
              </div>
              <button class="get-lyrics" data-artist="${song.artist.name}" data-song="${song.title}">Get lyrics</button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

// Listen to click on "Get lyrics" button
result.addEventListener("click", async (e) => {
  if (e.target.classList.contains("get-lyrics")) {
    const artist = e.target.dataset.artist;
    const song = e.target.dataset.song;
    try {
      const lyrics = await getLyrics(artist, song);
      showLyrics(artist, song, lyrics);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch lyrics. Please try again later.");
    }
  }
});

// Get lyrics function
async function getLyrics(artist, song) {
  const response = await fetch(`${apiURL}/v1/${artist}/${song}`);
  if (!response.ok) {
    throw new Error("Failed to fetch lyrics");
  }
  const data = await response.json();
  return data.lyrics;
}

// Display lyrics
function showLyrics(artist, song, lyrics) {
  result.innerHTML = `
    <div class="lyrics">
      <h2>${artist} - ${song}</h2>
      <pre>${lyrics}</pre>
    </div>
  `;
}
