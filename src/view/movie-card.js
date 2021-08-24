import dayjs from 'dayjs';
import AbstractView from './abstract.js';
const POPUP_OPEN_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];
const createMovieCardTemplate = (singleMovie) => {

  const { filmInfo: { title, description, poster, total_rating, genre, runtime, release:{date}}, comments }  = singleMovie;
  function getTimeFromMins(time) {
    const hours = Math.trunc(time/60);
    const minutes = time % 60;
    return hours + 'h ' + minutes + 'm';
  }

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
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
};


export default class MovieCard extends AbstractView{
  constructor(singleMovie) {
    super();
    this._singleMovie = singleMovie;
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._singleMovie);
  }
  _openPopupClickHandler(evt) {
    if (!POPUP_OPEN_CLASSES.includes(evt.target.className)) {
      return;
    }

    evt.preventDefault();

    this._callback.openPopupClick();
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClickHandler);
  }

  removeOpenPopupClickHandler() {
    this._callback.openPopupClick = null;
    this.getElement().removeEventListener('click', this._openPopupClickHandler);
  }
}
