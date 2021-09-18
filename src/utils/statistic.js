import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
const getWatchedMovies = (movies) => {movies.filter((movie) => movie.userDetails.alreadyWatched);
};
const getWatchedMoviesInDatesTimeline = (movies, dateFrom) => {
  const watchedMovies = getWatchedMovies(movies);
  return dateFrom !== 'all' ? watchedMovies.filter((movie) => dateFrom.isSameOrBefore(dayjs(movie.userDetails.watchingDate))) : watchedMovies;
};
const getGenres = (movies) => {
  const movieGenre = {};
  const watchedMovies = getWatchedMovies(movies);
  watchedMovies.forEach((movie) => {
    movie.movieInfo.genres.forEach((genre) => {
      if (genre in movieGenre) {
        movieGenre[genre] += 1;
      } else {
        movieGenre[genre] = 1;
      }
    });
  });
  return movieGenre;
};
const getSortedGenres = (movies) => {
  const movieGenre = getGenres(movies);
  return Object.entries(movieGenre).sort((firstGenre, secondGenre) => secondGenre[1] - firstGenre[1]);
};
const getTopGenre = (movies) => {getSortedGenres(movies)[0][0];
};
export {getWatchedMoviesInDatesTimeline, getSortedGenres, getTopGenre};
