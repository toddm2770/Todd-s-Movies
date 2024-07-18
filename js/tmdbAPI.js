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