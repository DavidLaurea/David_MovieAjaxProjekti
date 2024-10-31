document.addEventListener("DOMContentLoaded", function() {
    fetchTheaters();
    document.getElementById("theaterSelect").addEventListener("change", fetchMoviesByTheater);
    document.getElementById("searchButton").addEventListener("click", searchMovies);
});

function fetchTheaters() {
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

function displayMovies(shows, filter = "") {
    let movieInfoDiv = document.getElementById("movieInfo");
    movieInfoDiv.innerHTML = "";

    for (let i = 0; i < shows.length; i++) {
        let movieTitle = shows[i].getElementsByTagName("Title")[0].textContent;

        if (filter && !movieTitle.toLowerCase().includes(filter.toLowerCase())) {
            continue;
        }

        let startTime = shows[i].getElementsByTagName("dttmShowStart")[0].textContent;
        let imageUrl = shows[i].getElementsByTagName("EventSmallImagePortrait")[0].textContent;
        let genre = shows[i].getElementsByTagName("Genres")[0]?.textContent || "N/A";

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

function searchMovies() {
    let filter = document.getElementById("movieSearch").value.trim();
    let theaterID = document.getElementById("theaterSelect").value;
    if (!theaterID) return;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.finnkino.fi/xml/Schedule/?area=${theaterID}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let parser = new DOMParser();
            let xml = parser.parseFromString(xhr.responseText, "text/xml");
            let shows = xml.getElementsByTagName("Show");
            displayMovies(shows, filter);
        }
    };
    xhr.send();
}
