

//display popular movies
async function displayPopularMovies(){
    let movies = await getPopularMovies(); 

    document.getElementById("page-title").innerHTML = "Popular Movies";

    displayMovies(movies);
}

//display now playing movies
async function displayNowPlayingMovies(){
    let movies = await getNowPlayingMovies();

    document.getElementById("page-title").innerHTML = "Now Playing Movies";

    displayMovies(movies);
}

//display favorite movies
async function displayFavoriteMovies(){
    let movies = getFavoriteMovies();

    document.getElementById("page-title").innerHTML = "Favorite Movies";

    displayMovies(movies);
}

async function displaySearchResults(){
    let query = document.getElementById("movie-search").value;
    //'Captain America'
    let encodedValue = encodeURIComponent(query);
    let movies = await getMoviesByQuery(encodedValue);
    document.getElementById("page-title").innerHTML = `Search results for ${query}`;
    displayMovies(movies);
    uncheckButtons();
}

//display the details for the given movie
//the id will be passed by the query string
//used on the movieDetails page
async function displayMovieDetails(){
    const urlParams = new URLSearchParams(window.location.search);
    const defaultMovieId = "348350";
    let movieId = urlParams.get("id") || defaultMovieId;

    let movie = await getMovie(movieId);

    if(!movie){
        console.log(`Movie with id ${movieId} not found. Showing default movie instead`)
        movieId = defaultMovieId;
        movie = await getMovie(movieId);
    }

    let movieDetails = document.getElementById("movie-details");
    let backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    if(movie.backdrop_path == null){
        backdrop_path = "img/Backdrop.jpg";
    }

    movieDetails.style.background = `url(${backdrop_path}), linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.9))`;
    movieDetails.style.backgroundPosition = "cover";
    movieDetails.style.backgroundRepeat = "no-repeat";
    movieDetails.style.backgroundBlendMode = "overlay";

    //set the poster image
    let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    if(movie.poster_path == null){
        poster_path = `/img/poster.png`;
    }

    //display the movie poster
    document.getElementById("movie-poster").src = poster_path;

    //display the movie title
    document.getElementById("movie-title").innerText = movie.title;

    //display the movie certification
    document.getElementById("movie-certification").innerText = await getMovieRating(movie.id);

    //display release date
    document.getElementById("movie-release").innerText = (new Date(movie.release_date)).toLocaleDateString();

    //display runtime
    let minutes = movie.runtime % 60;
    let hours = (movie.runtime - minutes) / 60;
    document.getElementById("movie-runtime").textContent = `${hours}h ${minutes}m`;

    //display the movie genres
    document.getElementById("movie-genres").innerHTML = displayGenres(movie);

    //display movie overview
    document.getElementById("movie-overview").innerHTML = movie.overview;

    //display movie-tagline
    document.getElementById("movie-tagline").innerText = movie.tagline;

    //display the user rating
    document.getElementById("movie-rating").innerHTML = `${(movie.vote_average * 10).toFixed(0)}% User Score`;

    //load the trailer
    let videos = await getMovieVideos(movieId);
    if (videos.length < 1){
        document.getElementById("btn-trailer").style.display = "none";
    } else {
        document.getElementById("btn-trailer").style.display = "block";
    };

    //display the actors for the movie
    displayMovieCredits(movieId);
}

function displayMovies(movies){
    
    //get the movie card template
    const movieCardTemplate = document.getElementById("movie-card-template");

    //find the movie row element where all the movies go
    const movieRow = document.getElementById("movie-row");
    movieRow.innerHTML = "";

    //for each loop, shorthand for loop
    movies.forEach(movie => {

        let movieCard = document.importNode(movieCardTemplate.content, true);

        //modify the card for the current movie
        let titleElement = movieCard.querySelector('.card-body > .card-title');
        titleElement.textContent = movie.title; 

        let descriptionElement = movieCard.querySelector('.card-text');
        descriptionElement.textContent = new Date(movie.release_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});

        let movieImageElement = movieCard.querySelector(".card-img-top");
        let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        if (movie.poster_path == null){
        poster_path = "/img/poster.png";   
        }

        movieImageElement.setAttribute('src', poster_path);

        //set the buttons correctly
        let removeFavButton = movieCard.querySelector('[data-fav="true"]');
        removeFavButton.setAttribute('data-movieid', movie.id);

        let addFavButton = movieCard.querySelector('[data-fav="false"]');
        addFavButton.setAttribute('data-movieid', movie.id);

        if(isFavoriteMovie(movie.id)){
            addFavButton.style.display = 'none';
            removeFavButton.style.display = 'block';
        } else {
            addFavButton.style.display = 'block';
            removeFavButton.style.display = 'none';
        }

        let infoButton = movieCard.querySelector('[data-detail]');
        infoButton.href = `/movieDetails.html?id=${movie.id}`;

        movieRow.appendChild(movieCard);

    });
}

function displayGenres(movie){
    let genresTemplate = "";

    movie.genres.forEach(genre => {
        genresTemplate += `<span class="badge text-bg-info rounded-pill me-1">${genre.name}</span>`
    });

    return genresTemplate;
}

//display actors
async function displayMovieCredits(movieId){
    //get the case from the tmdb api
    let credits = await getMovieCredits(movieId);

    //pull the top ten actos for the movie
    let topBilledCast = credits.cast.slice(0,10);

    let slideContainer = document.getElementById("actors-slide-container");
    slideContainer.innerHTML = "";

    let actorSlideTemplate = document.getElementById("actor-slide");

    topBilledCast.forEach(actor =>{
        let slide = actorSlideTemplate.content.cloneNode(true);

        if(actor.profile_path != null){
            slide.querySelector("img").src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
        } else {
            slide.querySelector("img").src = "/img/profileImage.jpg";
        }

        slide.querySelector("[data-name]").textContent = actor.name;
        slide.querySelector("[data-character]").textContent = actor.character;

        slideContainer.appendChild(slide);
    })
}

//uncheck all the buttons in the button bar
function uncheckButtons(){
    let buttons = document.querySelectorAll("#btnBar .btn-check");

    let checkedButton = Array.from(buttons).find(button => button.checked);

    if (checkedButton){
        checkedButton.checked = false;
    }
}

/* #region favorite movies */

async function addFavoriteMovie(btn){
    let movieId = btn.getAttribute('data-movieid');

    let favorites = getFavoriteMovies();

    let duplicateMovie = favorites.find(movie => movie.id == movieId);

    if(duplicateMovie == undefined){
        let newFavorite = await getMovie(movieId);

        if(newFavorite != undefined){
            favorites.push(newFavorite);
            saveFavoriteMovies(favorites);
        }
    }
    selectAndClickMovieCategory();
}

async function removeFavoriteMovie(btn){

    let movieId = btn.getAttribute('data-movieid');

    let favorites = getFavoriteMovies();

    if(favorites){
        //if movie.id is not equal to movieId return favorites
        favorites = favorites.filter(movie => movie.id != movieId);
        saveFavoriteMovies(favorites);
    }
    selectAndClickMovieCategory();
}

function getFavoriteMovies(){
    let favoriteMovies = localStorage.getItem("tm-favorite-movies");
    if (favoriteMovies == null){
        favoriteMovies = [];
        saveFavoriteMovies(favoriteMovies);
    } else {
        favoriteMovies = JSON.parse(favoriteMovies);
    }

    return favoriteMovies;
}

//save favorite movies to local storage
function saveFavoriteMovies(movies){
    let moviesJSON = JSON.stringify(movies);
    localStorage.setItem("tm-favorite-movies", moviesJSON);
}

function isFavoriteMovie(movieid){
    let favoriteMovies = getFavoriteMovies();

    if(!favoriteMovies){
        return false;
    }

    return favoriteMovies.some(movie => movie.id == movieid);
}

function selectAndClickMovieCategory(){

    //get all the buttons in the bar
    let buttons = document.querySelectorAll("#btnBar .btn-check");

    //find the currently selected button
    let checkedButton = Array.from(buttons).find(button => button.checked);

    //call the click event on the checked button
    if (checkedButton){
        checkedButton.click();
    }
}

/* #endregion favorite movies */

//load trailer
async function loadVideo(){
    let movieId = new URLSearchParams(window.location.search);
    const defaultMovieId = "348350";
    movieId = movieId.get("id") || defaultMovieId;

    let videos = await getMovieVideos(movieId);

    if (videos.length > 0){
        let defaultVideo = videos[0];
        videos = videos.filter(videos => videos.type == "Trailer");
        let trailerVideo = videos[0] || defaultVideo;
        document.getElementById("movieModalLabel").textContent = trailerVideo.name;
        document.getElementById("movie-trailer").src = `https://www.youtube.com/embed/${trailerVideo.key}`
    }
}

async function unloadVideo(){
    document.getElementById("movie-trailer").src = "";
}

