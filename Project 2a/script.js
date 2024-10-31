// On page load, fetch theaters and add event listeners
document.addEventListener("DOMContentLoaded", function() {
    fetchTheaters();

    // Event listener to fetch movies when a theater is selected
    document.getElementById("theaterSelect").addEventListener("change", fetchMoviesByTheater);
});

// Fetch theater information from Finnkino API
function fetchTheaters() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(xhr.responseText, "text/xml");
            let theaters = xml.getElementsByTagName("TheatreArea");
            let theaterSelect = document.getElementById("theaterSelect");

            // Populate theater dropdown
            for (let i = 0; i < theaters.length; i++) {
                let option = document.createElement("option");
                option.value = theaters[i].getElementsByTagName("ID")[0].textContent;
                option.textContent = theaters[i].getElementsByTagName("Name")[0].textContent;
                theaterSelect.appendChild(option);
            }
        }
    };
    xhr.send();
}

// Fetch movie schedule based on selected theater
function fetchMoviesByTheater() {
    let theaterID = document.getElementById("theaterSelect").value;
    if (!theaterID) return;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.finnkino.fi/xml/Schedule/?area=${theaterID}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(xhr.responseText, "text/xml");
            let shows = xml.getElementsByTagName("Show");
            displayMovies(shows);
        }
    };
    xhr.send();
}

// Display movies from Finnkino schedule
function displayMovies(shows) {
    let movieInfoDiv = document.getElementById("movieInfo");
    movieInfoDiv.innerHTML = ""; // Clear previous movies

    for (let i = 0; i < shows.length; i++) {
        let movieTitle = shows[i].getElementsByTagName("Title")[0].textContent;
        let startTime = shows[i].getElementsByTagName("dttmShowStart")[0].textContent;
        let imageUrl = shows[i].getElementsByTagName("EventSmallImagePortrait")[0].textContent;
        let genre = shows[i].getElementsByTagName("Genres")[0]?.textContent || "N/A";

        // Create movie card element
        let movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
            <img src="${imageUrl}" alt="Movie Poster">
            <h3>${movieTitle}</h3>
            <p>Start time: ${startTime}</p>
            <p>Genre: ${genre}</p>
        `;
        movieInfoDiv.appendChild(movieCard);
    }
}
