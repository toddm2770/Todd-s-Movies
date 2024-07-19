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