import he from 'he';
import Smart from './smart';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const Emotion = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};
const formatReleaseDate = (releaseDate) => {dayjs(releaseDate).format('DD MMMM YYYY');
};
const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - (hours * 60);
  return `${hours}h ${minutes}m`;
};
const formatCommentDate = (date) => {dayjs().to(dayjs(date));
};
const createGenresTemplate = (genres) => {genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};
const createCommentTemplate = (comment, deletingCommentId, isDeletingNow) => {
  const {
    author,
    content,
    date,
    emotion,
    id,
  } = comment;
  const formattedDate = formatCommentDate(date);
  const isCommentDeleting = isDeletingNow && deletingCommentId === id;
  const isDeleteButtonDisabled = isCommentDeleting ? 'disabled' : '';
  const deleteButtonText = isCommentDeleting ? 'Deleting...' : 'Delete';
  return `<li class="film-details__comment" data-comment-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${content}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formattedDate}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}" ${isDeleteButtonDisabled}>${deleteButtonText}</button>
      </p>
    </div>
  </li>`;
};
const createCommentsTemplate = (comments, deletingCommentId, isDeletingNow) => {
  const commentsItemsTemplate = comments.map((comment) => createCommentTemplate(comment, deletingCommentId, isDeletingNow)).join('');
  return comments.length > 0 ? `<ul class="film-details__comments-list">${commentsItemsTemplate}</ul>` : '<p>Failed to load comments</p>';
};
const createSelectedEmotionTemplate = (selectedEmotion) => {selectedEmotion ? `<img src="images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji-${selectedEmotion}">` : '';
};
const createEmotionItemTemplate = (emotion, selectedEmotion, isSavingNow) => {
  const isInputChecked = emotion === selectedEmotion ? 'checked' : '';
  const isInputDisabled = isSavingNow ? 'disabled' : '';
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${isInputChecked} ${isInputDisabled}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
};
const createEmotionListTemplate = (selectedEmotion, isSavingNow) => {`<div class="film-details__emoji-list">
      ${Object.values(Emotion).map((emotion) => createEmotionItemTemplate(emotion, selectedEmotion, isSavingNow)).join('')}
    </div>`;
};
const createmoviePopupTemplate = (data, comments) => {
  const {
    movieInfo,
    userDetails,
  } = data;
  const {
    state,
  } = data;
  const {
    actors,
    ageRating,
    alternativeTitle,
    country,
    description,
    director,
    genres,
    poster,
    releaseDate,
    runtime,
    title,
    totalRating,
    writers,
  } = movieInfo;
  const {
    alreadyWatched,
    favorite,
    watchlist,
  } = userDetails;
  const {
    commentText,
    deletingCommentId,
    emotion,
    isDeletingNow,
    isSavingNow,
  } = state;
  const formattedWriters = writers.join(', ');
  const formattedActors = actors.join(', ');
  const formattedReleaseDate = formatReleaseDate(releaseDate);
  const formattedRuntime = formatRuntime(runtime);
  const genresTemplate = createGenresTemplate(genres);
  const watchlistInputCheck = watchlist ? 'checked' : '';
  const watchedInputCheck = alreadyWatched ? 'checked' : '';
  const favoriteInputCheck = favorite ? 'checked' : '';
  const commentsCount = comments.length;
  const commentsTemplate = createCommentsTemplate(comments, deletingCommentId, isDeletingNow);
  const selectedEmotionTemplate = createSelectedEmotionTemplate(emotion);
  const emotionListTemplate = createEmotionListTemplate(emotion, isSavingNow);
  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${formattedWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${formattedActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formattedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formattedRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genre${genres.length > 1 ? 's' : ''}</td>
                <td class="film-details__cell">${genresTemplate}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistInputCheck}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedInputCheck}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteInputCheck}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${selectedEmotionTemplate}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSavingNow ? 'disabled' : ''}>${he.encode(commentText)}</textarea>
            </label>

            ${emotionListTemplate}
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class moviePopup extends Smart {
  constructor(movie, CommentsModel) {
    super();
    this._data = moviePopup.parsemovieToData(movie);
    this._CommentsModel = CommentsModel;
    this._addToWatchlistButtonClickHandler = this._addToWatchlistButtonClickHandler.bind(this);
    this._alreadyWatchedButtonClickHandler = this._alreadyWatchedButtonClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._deleteCommentButtonClickHandler = this._deleteCommentButtonClickHandler.bind(this);
    this._commentSubmitFormHandler = this._commentSubmitFormHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._commentEmotionChangeHandler = this._commentEmotionChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createmoviePopupTemplate(this._data, this._CommentsModel.getComments());
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setAddToWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setAlreadyWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setDeleteCommentButtonClickHandler(this._callback.deleteCommentButtonClick);
    this.setCommentFormSubmitHandler(this._callback.commentFormSubmit);
  }

  _alreadyWatchedButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedButtonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  }

  _addToWatchlistButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistButtonClick();
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _deleteCommentButtonClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    const deletingCommentId = evt.target.dataset.commentId;
    this._callback.deleteCommentButtonClick(deletingCommentId);
  }

  _commentEmotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      state: {
        ...this._data.state,
        emotion: evt.target.value,
      },
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      state: {
        ...this._data.state,
        commentText: evt.target.value,
      },
    },
    true,
    );
  }

  setAddToWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('change', this._addToWatchlistButtonClickHandler);
  }

  setAlreadyWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('#watched').addEventListener('change', this._alreadyWatchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('change', this._favoriteButtonClickHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setDeleteCommentButtonClickHandler(callback) {
    this._callback.deleteCommentButtonClick = callback;
    const commentsList = this.getElement().querySelector('.film-details__comments-list');
    if (commentsList) {
      commentsList.addEventListener('click', this._deleteCommentButtonClickHandler);
    }
  }

  setCommentFormSubmitHandler(callback) {
    this._callback.commentFormSubmit = callback;
    this.getElement().addEventListener('keydown', this._commentSubmitFormHandler);
  }

  _setCommentInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _setEmotionChangeHandler() {
    const inputs = this.getElement().querySelectorAll('.film-details__emoji-item');
    for (const input of inputs) {
      input.addEventListener('change', this._commentEmotionChangeHandler);
    }
  }

  _setInnerHandlers() {
    this._setCommentInputHandler();
    this._setEmotionChangeHandler();
  }

  static parsemovieToData(movie) {
    return Object.assign(
      {},
      movie,
      {
        state: {
          commentText: '',
          deletingCommentId: null,
          emotion: null,
          isSavingNow: false,
          isDeletingNow: false,
          isDisabled: false,
        },
      },
    );
  }

  static parseDataToComment(data) {
    const localComment = {
      comment: data.state.commentText,
      emotion: data.state.emotion,
    };
    this._data = null;
    return localComment;
  }
}
