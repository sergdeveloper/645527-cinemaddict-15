import Observer from '../utils/observer';
export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies.slice();
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error('Cant update movie');
    }
    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        movie_info: {
          ...movie.movieInfo,
          alternative_title: movie.movieInfo.alternativeTitle,
          age_rating: movie.movieInfo.ageRating,
          genre: movie.movieInfo.genres,
          release: {
            release_country: movie.movieInfo.country,
            date: movie.movieInfo.releaseDate.toISOString(),
          },
          total_rating: movie.movieInfo.totalRating,
        },
        user_details: {
          ...movie.userDetails,
          already_watched: movie.userDetails.alreadyWatched,
          watching_date: movie.userDetails.watchingDate,
        },
      },
    );
    delete adaptedMovie.movie_info.country;
    delete adaptedMovie.movie_info.genres;
    delete adaptedMovie.movie_info.totalRating;
    delete adaptedMovie.movieInfo;
    delete adaptedMovie.movie_info.ageRating;
    delete adaptedMovie.movie_info.alternativeTitle;
    delete adaptedMovie.user_details.watchingDate;
    delete adaptedMovie.userDetails;
    delete adaptedMovie.user_details.alreadyWatched;
    return adaptedMovie;
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        movieInfo: {
          ...movie.movie_info,
          country: movie.movie_info.release.release_country,
          genres: movie.movie_info.genre,
          ageRating: movie.movie_info.age_rating,
          alternativeTitle: movie.movie_info.alternative_title,
          releaseDate: new Date(movie.movie_info.release.date),
          totalRating: movie.movie_info.total_rating,
        },
        userDetails: {
          ...movie.user_details,
          watchingDate: movie.user_details.watching_date,
          alreadyWatched: movie.user_details.already_watched,
        },
      },
    );
    delete adaptedMovie.movie_info;
    delete adaptedMovie.movieInfo.age_rating;
    delete adaptedMovie.movieInfo.alternative_title;
    delete adaptedMovie.movieInfo.genre;
    delete adaptedMovie.movieInfo.release;
    delete adaptedMovie.movieInfo.total_rating;
    delete adaptedMovie.user_details;
    delete adaptedMovie.userDetails.already_watched;
    delete adaptedMovie.userDetails.watching_date;
    return adaptedMovie;
  }
}
