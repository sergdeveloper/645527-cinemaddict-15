const MOST_COMMENTED_MOVIES_AMOUNT = 2;
const TOP_RATED_MOVIES_AMOUNT = 2;

const getMostCommentedMovies = (movies) => {
  return movies.slice().sort((second, first) => first.comments.length - second.comments.length).slice(0, MOST_COMMENTED_MOVIES_AMOUNT);
};

const getTopRatedMovies = (movies) => {
  return movies.slice().sort((second, first) => first.filmInfo.total_rating - second.filmInfo.total_rating).slice(0, TOP_RATED_MOVIES_AMOUNT);
};

const getSortedMoviesByDate = (films) => {
  return films.slice().sort((firstFilm, secondFilm) => secondFilm.filmInfo.release_date - firstFilm.filmInfo.release_date);
};

const getSortedMoviesByRating = (films) => {
  return films.slice().sort((firstFilm, secondFilm) => secondFilm.filmInfo.total_rating - firstFilm.filmInfo.total_rating);
};

export {getMostCommentedMovies, getTopRatedMovies, getSortedMoviesByDate, getSortedMoviesByRating};
