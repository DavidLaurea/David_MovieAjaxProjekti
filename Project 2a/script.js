// Hakee teatterit Finnkino API:sta ja täytä avattava valikko
document.addEventListener("DOMContentLoaded", function() {
    fetchTheaters();

    document.getElementById("searchButton").addEventListener("click", fetchMovieInfo);
    document.getElementById("theaterSelect").addEventListener("change", fetchMoviesByTheater);
});

function fetchTheaters() {
    // Ajax kutsuu Finnkino API:lle saadakseen teatteritietoja
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(xhr.responseText, "text/xml");
            let theaters = xml.getElementsByTagName("TheatreArea");
            let theaterSelect = document.getElementById("theaterSelect");

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

function displayMovies(shows) {
    let movieInfoDiv = document.getElementById("movieInfo");
    movieInfoDiv.innerHTML = ""; // Ottaa pois edellisen elokuvan

    for (let i = 0; i < shows.length; i++) {
        let movieTitle = shows[i].getElementsByTagName("Title")[0].textContent;
        let startTime = shows[i].getElementsByTagName("dttmShowStart")[0].textContent;
        let imageUrl = shows[i].getElementsByTagName("EventSmallImagePortrait")[0].textContent;

        let movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
            <img src="${imageUrl}" alt="Movie Poster">
            <h3>${movieTitle}</h3>
            <p>Start time: ${startTime}</p>
        `;
        movieInfoDiv.appendChild(movieCard);
    }
}

function fetchMovieInfo() {
    let movieTitle = document.getElementById("movieSearch").value;
    if (!movieTitle) return;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.omdbapi.com/?t=${movieTitle}&apikey=YOUR_API_KEY`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let movie = JSON.parse(xhr.responseText);
            displaySingleMovie(movie);
        }
    };
    xhr.send();
}

function displaySingleMovie(movie) {
    let movieInfoDiv = document.getElementById("movieInfo");
    movieInfoDiv.innerHTML = ""; // Ottaa pois edellisen elokuvan tiedot

    if (movie.Response === "False") {
        movieInfoDiv.textContent = "Movie not found!";
        return;
    }

    let movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    movieCard.innerHTML = `
        <img src="${movie.Poster}" alt="Movie Poster">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <p>Genre: ${movie.Genre}</p>
        <p>Plot: ${movie.Plot}</p>
    `;
    movieInfoDiv.appendChild(movieCard);
}
