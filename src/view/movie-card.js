import Abstract from './abstract';
import dayjs from 'dayjs';
const POPUPS_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];
const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - (hours * 60);
  return `${hours}h ${minutes}m`;
};
const formatDescription = (description) => {description.length > 140 ? description.slice(0, 139).concat('…') : description;
};
const createMovieCardTemplate = (movie) => {
  const {
    comments,
    movieInfo,
    userDetails,
  } = movie;
  const {
    description,
    genres,
    poster,
    releaseDate,
    runtime,
    title,
    totalRating,
  } = movieInfo;
  const {
    alreadyWatched,
    favorite,
    watchlist,
  } = userDetails;
  const releaseYear = dayjs(releaseDate).format('YYYY');
  const formattedRuntime = formatRuntime(runtime);
  const formattedGenres = genres.join(', ');
  const formattedDescription = formatDescription(description);
  const commentsCount = comments.length;
  const watchlistButtonClass = watchlist ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active' : 'film-card__controls-item--add-to-watchlist';
  const watchedButtonClass = alreadyWatched ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active' : 'film-card__controls-item--mark-as-watched';
  const favoriteButtonClass = favorite ? 'film-card__controls-item--favorite film-card__controls-item--active' : 'film-card__controls-item--favorite';
  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${formattedRuntime}</span>
      <span class="film-card__genre">${formattedGenres}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${formattedDescription}</p>
    <a class="film-card__comments">${commentsCount} comment${commentsCount > 1 ? 's' : ''}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button ${watchlistButtonClass}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button ${watchedButtonClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button ${favoriteButtonClass}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
export default class movieCard extends Abstract {
  constructor(movie) {
    super();
    this._movie = movie;
    this._addToWatchlistButtonClickHandler = this._addToWatchlistButtonClickHandler.bind(this);
    this._alreadyWatchedButtonClickHandler = this._alreadyWatchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  _addToWatchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistButtonClick();
  }

  _alreadyWatchedButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedButtonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  }

  _openPopupClickHandler(evt) {
    if (!POPUPS_CLASSES.includes(evt.target.className)) {
      return;
    }
    evt.preventDefault();
    this._callback.openPopupClick();
  }

  setAddToWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addToWatchlistButtonClickHandler);
  }

  setAlreadyWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClickHandler);
  }
}
