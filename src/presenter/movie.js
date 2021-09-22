import movieCardView from '../view/movie-card';
import moviePopupView from '../view/popup';
import {UpdateType, FilterType} from '../update-filter-types';
import {remove, render, replace} from '../utils/render';
const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_MOVIE: 'UPDATE_MOVIE',
};
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};
export const State = {
  ABORTING: 'ABORTING',
  DELETING: 'DELETING',
  SAVING: 'SAVING',
};
export const AbortingClassOfElement = {
  ADDING_COMMENT: 'movie-details__new-comment',
  REMOVING_COMMENT: 'movie-details__comment',
};
export default class Movie {
  constructor(movieListContainer, changeData, changeMode, CommentsModel,FilterModel, api) {
    this._movieListContainer = movieListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._CommentsModel = CommentsModel;
    this._FilterModel = FilterModel;
    this._siteBody = document.body;
    this._movieCardComponent = null;
    this._moviePopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._api = api;
    this._handleWatchlistButtonClick = this._handleWatchlistButtonClick.bind(this);
    this._handleAlreadyWatchedButtonClick = this._handleAlreadyWatchedButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleMovieCardClick = this._handleMovieCardClick.bind(this);
    this._handlePopupDeleteComment = this._handlePopupDeleteComment.bind(this);
    this._handlePopupClose = this._handlePopupClose.bind(this);
    this._handleCommentFormSubmit = this._handleCommentFormSubmit.bind(this);
    this._escapePressHandler = this._escapePressHandler.bind(this);
    this._movie = null;
  }

  init(movie) {
    this._movie = movie;
    const preMovieCardComponent = this._movieCardComponent;
    this._movieCardComponent = new movieCardView(this._movie);
    this._setMovieCardHandlers();
    if (preMovieCardComponent === null) {
      render(this._movieListContainer, this._movieCardComponent);
    } else {
      replace(this._movieCardComponent, preMovieCardComponent);
      remove(preMovieCardComponent);
    }
    if (this._mode === Mode.POPUP) {
      this._moviePopupComponent.updateData(this._movie);
    }
  }

  destroy() {
    remove(this._movieCardComponent);
    if (this._moviePopupComponent) {
      remove(this._moviePopupComponent);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hidePopup();
    }
  }

  setViewState(state, deletingCommentId, shakingElementSelector) {
    const resetFormState = () => {
      this._moviePopupComponent.updateData({
        'state': {
          deletingCommentId: null,
          isSavingNow: false,
          isDisabled: false,
          isDeletingNow: false,
        },
      });
    };
    switch (state) {
      case State.SAVING:
        this._moviePopupComponent.updateData({
          'state': {
            isDisabled: true,
            isSavingNow: true,
          },
        });
        break;
      case State.DELETING:
        this._moviePopupComponent.updateData({
          'state': {
            isDisabled: true,
            isDeletingNow: true,
            deletingCommentId,
          },
        });
        break;
      case State.ABORTING:
        this._moviePopupComponent.shake(resetFormState, shakingElementSelector);
        break;
    }
  }

  _setMoviePopupHandlers() {
    this._moviePopupComponent.setCloseButtonClickHandler(this._handlePopupClose);
    this._moviePopupComponent.setDeleteCommentButtonClickHandler(this._handlePopupDeleteComment);
    this._moviePopupComponent.setCommentFormSubmitHandler(this._handleCommentFormSubmit);
    this._moviePopupComponent.setAddToWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._moviePopupComponent.setAlreadyWatchedButtonClickHandler(this._handleAlreadyWatchedButtonClick);
    this._moviePopupComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
  }

  _setMovieCardHandlers() {
    this._movieCardComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._movieCardComponent.setOpenPopupClickHandler(this._handleMovieCardClick);
    this._movieCardComponent.setAddToWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._movieCardComponent.setAlreadyWatchedButtonClickHandler(this._handleAlreadyWatchedButtonClick);
  }

  _showPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;
    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._CommentsModel.setComments(comments);
        this._moviePopupComponent = new moviePopupView(this._movie, this._CommentsModel);
        this._setMoviePopupHandlers();
        this._siteBody.classList.add('hide-overflow');
        render(this._siteBody, this._moviePopupComponent);
        document.addEventListener('keydown', this._escapePressHandler);
      })
      .catch(() => {
        this._CommentsModel.setComments([]);
        this._moviePopupComponent = new moviePopupView(this._movie, this._CommentsModel);
        this._setMoviePopupHandlers();
        this._siteBody.classList.add('hide-overflow');
        render(this._siteBody, this._moviePopupComponent);
        document.addEventListener('keydown', this._escapePressHandler);
      });
  }

  _hidePopup() {
    this._mode = Mode.DEFAULT;
    this._siteBody.classList.remove('hide-overflow');
    remove(this._moviePopupComponent);
    this._moviePopupComponent = null;
    document.removeEventListener('keydown', this._escapePressHandler);
  }

  _handleAlreadyWatchedButtonClick() {
    const updateType = this._FilterModel.getFilter() === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR;
    this._changeData(
      UserAction.UPDATE_movie,
      updateType,
      Object.assign(
        {},
        this._movie,
        {
          userDetails: {
            ...this._movie.userDetails,
            alreadyWatched: !this._movie.userDetails.alreadyWatched,
          },
        },
      ),
    );
  }

  _handleWatchlistButtonClick() {
    const updateType = this._FilterModel.getFilter() === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR;
    this._changeData(
      UserAction.UPDATE_movie,
      updateType,
      Object.assign(
        {},
        this._movie,
        {
          userDetails: {
            ...this._movie.userDetails,
            watchlist: !this._movie.userDetails.watchlist,
          },
        },
      ),
    );
  }

  _handleFavoriteButtonClick() {
    const updateType = this._FilterModel.getFilter() === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR;
    this._changeData(
      UserAction.UPDATE_movie,
      updateType,
      Object.assign(
        {},
        this._movie,
        {
          userDetails: {
            ...this._movie.userDetails,
            favorite: !this._movie.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handlePopupClose() {
    this._hidePopup();
  }

  _escapePressHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._hidePopup();
    }
  }

  _handleMovieCardClick() {
    this._showPopup();
  }

  _handleCommentFormSubmit(comment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
      ),
      null,
      comment,
    );
  }

  _handlePopupDeleteComment(commentId) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
      ),
      commentId,
    );
  }
}
