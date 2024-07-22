displayNowPlayingMovies()

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

        movieRow.appendChild(movieCard);

    });
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