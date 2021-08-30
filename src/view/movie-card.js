import dayjs from 'dayjs';
import AbstractView from './abstract.js';
const POPUP_OPEN_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];
const createMovieCardTemplate = (singleMovie) => {

  const { filmInfo: { title, description, poster, total_rating, genre, runtime, release:{date}}, comments, user_details:{watchlist, already_watched, favorite}}  = singleMovie;
  function getTimeFromMins(time) {
    const hours = Math.trunc(time/60);
    const minutes = time % 60;
    return hours + 'h ' + minutes + 'm';
  }

  const watchlistButtonClass = watchlist ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active' : 'film-card__controls-item--add-to-watchlist';
  const watchedButtonClass = already_watched ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active' : 'film-card__controls-item--mark-as-watched';
  const favoriteButtonClass = favorite ? 'film-card__controls-item--favorite film-card__controls-item--active' : 'film-card__controls-item--favorite';

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${total_rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
    <span class="film-card__duration">${getTimeFromMins(runtime)}</span>
    <span class="film-card__genre">${genre}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${comments.length} comments </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item button ${watchlistButtonClass}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item button ${watchedButtonClass}" type="button">Mark as watched</button>
  <button class="film-card__controls-item button ${favoriteButtonClass}" type="button">Mark as favorite</button>
  </div>
</article>`;
};


export default class MovieCard extends AbstractView{
  constructor(singleMovie) {
    super();
    this._singleMovie = singleMovie;
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._singleMovie);
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistButtonClick();
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchedButtonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.favoriteButtonClick();
  }

  _openPopupClickHandler(evt) {
    if (!POPUP_OPEN_CLASSES.includes(evt.target.className)) {
      return;
    }

    evt.preventDefault();

    this._callback.openPopupClick();
  }

  setWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClickHandler);
  }

  removeHandler() {
    this._callback = {};
    this.getElement().removeEventListener('click', this._openPopupClickHandler);
    this.getElement().removeEventListener('click', this._watchlistButtonClickHandler);
    this.getElement().removeEventListener('click', this._watchedButtonClickHandler);
    this.getElement().removeEventListener('click', this._favoriteButtonClickHandler);
  }
}
