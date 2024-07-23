const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWNjOTQ1OGY1ODhkYmEyZTZjODVhOGUyNzU2ZDhkNCIsIm5iZiI6MTcyMTMzNDA3Ny4yNTE1OTcsInN1YiI6IjY2OTk2YzE4ZGJlNWZkNWJlOTRiODAyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zR8Cw4hp1k5HHZRSK4ktVdPJXYhlK15VfdoJ3GI7oQw';

/**Fetches and returns a list of popular movies currently playing in theatres 
 * @returns {object} a list of currently playing movies  as javascript object
 * @throws {error} if the network response is not ok
*/
async function getPopularMovies(){
    const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular`;

    try{
        let response = await fetch(popularMoviesUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
                
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let popularMovies = await response.json();
        return popularMovies.results;
    } catch (error){
        console.error(`Popular Movies Fetch Error: ${error}`);
        return [];
    }
}

async function getNowPlayingMovies(){
    const nowPlayingMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing`;

    try{
        let response = await fetch(nowPlayingMoviesUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
                
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let nowPlayingMovies = await response.json();
        return nowPlayingMovies.results;
    } catch (error){
        console.error(`Now Playing Movies Fetch Error: ${error}`);
        return [];
    }
}

async function getMoviesByQuery(query){

    //https://api.themoviedb.org/3/search/movie
    //https://api.themoviedb.org/3/search/movie?query=Captain%20America&include_adult=false&language=en-US&page=1
    const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?query=${query}`;

    try{
        let response = await fetch(searchMoviesUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
                
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let foundMovies = await response.json();
        return foundMovies.results;
    } catch (error){
        console.error(`Search Movies Fetch Error: ${error}`);
        return [];
    }
}


/**
 * 
 * @param {number} movieId 
 * @returns return a movie object from teh TMDB API
 */
async function getMovie(movieId){
    //https://api.themoviedb.org/3/movie/{movie_id}

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
    try{
        let response = await fetch(movieUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let movie = await response.json();
        return movie;
    } catch (error){
        console.error(`Get Movie Fetch Error: ${error}`);
        return null;
    }
}

async function getMovieRating(movieId){
        //https://api.themoviedb.org/3/search/movie
    const releaseDateUrl = `https://api.themoviedb.org/3/movie/${movieId}/release_dates`;

    try{
        let response = await fetch(releaseDateUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
                
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let releaseDates = await response.json();

        let usReleaseDates = releaseDates.results.find(rd => rd.iso_3166_1 === 'US');

        if(!usReleaseDates) return "NR";

        let releaseDate = usReleaseDates.release_dates.find(rd => rd.certification != "");

        return releaseDate ? releaseDate.certification : "NR";
    } catch (error){
        console.error(`Release Date Fetch Error: ${error}`);
        return "NR";
    }
}

async function getMovieVideos(movieId){
    //https://api.themoviedb.org/3/movie/{movie_id}/videos

    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;
    try{
        let response = await fetch(videosUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let videos = await response.json();
        return videos.results;
    } catch (error){
        console.error(`Get Movie Fetch Error: ${error}`);
        return null;
    }

}


/**
 * 
 * @param {*} movieId 
 * @returns cast and crew for a movie
 */
async function getMovieCredits(movieId){
    //https://api.themoviedb.org/3/movie/{movie_id}/credits

    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
    try{
        let response = await fetch(creditsUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let credits = await response.json();
        return credits;
    } catch (error){
        console.error(`Get Credits Fetch Error: ${error}`);
        return [];
    }
}

async function getAllGenres(){
    //https://api.themoviedb.org/3/genre/movie/list

    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list`;
    try{
        let response = await fetch(genreUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let genre = await response.json();
        return genre;
    } catch (error){
        console.error(`Get Credits Fetch Error: ${error}`);
        return [];
    }
}

