displayPopularMovies();

async function displayPopularMovies(){
    let movies = await getPopularMovies();

    displayMovies(movies);
}

function displayMovies(movies){
    
    //get the movie card template
    const movieCardTemplate = document.getElementById("movie-card-template");

    //find the movie row element where all the movies go
    const movieRow = document.getElementById("movie-row");
    movieRow.innerHTML = "";

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

        movieRow.appendChild(movieCard);

    });
}
