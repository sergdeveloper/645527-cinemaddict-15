import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Smart from './smart.js';
dayjs.extend(relativeTime)


const Emote = {
  SMILE: 'smile',
  PUKE: 'puke',
  ANGRY: 'angry',
  SLEEPING: 'sleeping',
};

const createChosenEmoteTemplate = (selectedEmote) => {
  return selectedEmote ? `<img src="./images/emoji/${selectedEmote}.png" width="55" height="55" alt="emoji-${selectedEmote}">` : '';
};

const createEmoteItemTemplate = (emote, selectedEmote) => {
  const isInputChecked = emote === selectedEmote ? 'checked' : '';

  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emote}" value="${emote}" ${isInputChecked}>
    <label class="film-details__emoji-label" for="emoji-${emote}">
      <img src="./images/emoji/${emote}.png" width="30" height="30" alt="emoji">
    </label>`;
};

const createEmoteListTemplate = (selectedEmote) => {
  return `<div class="film-details__emoji-list">
      ${Object.values(Emote).map((emote) => createEmoteItemTemplate(emote, selectedEmote)).join('')}
    </div>`;
};

const createUserCommentTemplate = (data) => {
  const {author, comment, date, emotion} = data;
  return`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs().to(dayjs(date))}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

const createAllUserCommentsTemplate = (comments) => {
  return comments.map((singleComment) => createUserCommentTemplate(singleComment)).join('');
};

const createPopupMovieTemplate = (data) => {

  function getTimeFromMins(time) {
    const hours = Math.trunc(time/60);
    const minutes = time % 60;
    return hours + 'h ' + minutes + 'm';
  }

  const { filmInfo: { title, description, poster, total_rating, genre, director, writers, runtime, actors, release:{date, release_country}},comments, user_details:{watchlist, already_watched, favorite} } = data;
  const {state,} = data;
  const {commentContent,} = state;
  const allComments = createAllUserCommentsTemplate(comments);

  const watchlistButtonClass = watchlist ? 'film-details__control-button--watchlist film-details__control-button--active' : 'film-details__control-button--watchlist';
  const watchedButtonClass = already_watched ? 'film-details__control-button--active' : '';
  const favoriteButtonClass = favorite ? 'film-details__control-button--active' : '';
  const emoteListTemplate = createEmoteListTemplate(state.emote);
  const selectedEmoteTemplate = createChosenEmoteTemplate(state.emote);
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${total_rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format('DD MMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimeFromMins(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release_country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
           ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistButtonClass}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedButtonClass}"  id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteButtonClass}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${allComments}
        </ul>

        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${selectedEmoteTemplate}</div>


        <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentContent}</textarea>
      </label>
        ${emoteListTemplate}
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class MoviePopup extends Smart{
  constructor(singleMovie) {
    super();
    this._data = MoviePopup.parseMovieToData(singleMovie);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentEmoteChangeHandler = this._commentEmoteChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupMovieTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
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

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _commentEmoteChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      state: {
        ...this._data.state,
        emote: evt.target.value,
      },
    },
    false,
    this.getElement().scrollTop,
    );
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      state: {
        ...this._data.state,
        commentContent: evt.target.value,
      },
    },
    true,
    );
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._watchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteButtonClickHandler);
  }

  _setCommentInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _setEmoteChangeHandler() {
    const inputs = this.getElement().querySelectorAll('.film-details__emoji-item');
    for (const input of inputs) {
      input.addEventListener('change', this._commentEmoteChangeHandler);
    }
  }

  _setInnerHandlers() {
    this._setCommentInputHandler();
    this._setEmoteChangeHandler();
  }

  static parseMovieToData(singleMovie) {
    return Object.assign(
      {},
      singleMovie,
      {
        state: {
          emote: null,
          commentContent: '',
        },
      },
    );
  }

  static parseDataToMovie(data) {
    data = Object.assign({}, data);
    delete data.state;
    return data;
  }
}
