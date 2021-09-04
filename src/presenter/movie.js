import MovieCardView from '../view/movie-card.js';
import MoviePopupView from '../view/popup.js';
import {remove, render, replace} from '../utils/render';
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListContainer, changeFilm, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;
    this._siteBody = document.body;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._handleWatchlistButtonClick = this._handleWatchlistButtonClick.bind(this);
    this._handleWatchedButtonClick = this._handleWatchedButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._film = null;
  }

  init(film) {
    this._film = film;
    const prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new MovieCardView(this._film);

    this._setFilmCardHandlers();
    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent);
    } else {
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }
   }

  destroy() {
    remove(this._filmCardComponent);
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
   }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hidePopup();
    }
  }

  _showPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;
    this._filmPopupComponent = new MoviePopupView(this._film);
    this._siteBody.classList.add('hide-overflow');
    render(this._siteBody, this._filmPopupComponent);
    this._setFilmPopupHandlers();
    document.addEventListener('keydown', this._escKeyDownHandler);
   }

  _setFilmCardHandlers() {
    this._filmCardComponent.setWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._filmCardComponent.setWatchedButtonClickHandler(this._handleWatchedButtonClick);
    this._filmCardComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._filmCardComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
  }

  _setFilmPopupHandlers() {
    this._filmPopupComponent.setWatchlistButtonClickHandler(this._handleWatchlistButtonClick);
    this._filmPopupComponent.setWatchedButtonClickHandler(this._handleWatchedButtonClick);
    this._filmPopupComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._filmPopupComponent.setCloseButtonClickHandler(this._handlePopupCloseButtonClick);
  }

   _hidePopup() {
     this._mode = Mode.DEFAULT;
     this._siteBody.classList.remove('hide-overflow');
     remove(this._filmPopupComponent);
     this._filmPopupComponent = null;
     document.removeEventListener('keydown', this._escKeyDownHandler);
   }

  _handleWatchlistButtonClick() {
    this._changeFilm(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            ...this._film.user_details,
            watchlist: !this._film.user_details.watchlist,
          },
        },
      ),
    );
  }

  _handleWatchedButtonClick() {
    this._changeFilm(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            ...this._film.user_details,
            already_watched: !this._film.user_details.already_watched,
          },
        },
      ),
    );
  }

  _handleFavoriteButtonClick() {
    this._changeFilm(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            ...this._film.user_details,
            favorite: !this._film.user_details.favorite,
          },
        },
      ),
    );
  }

  _handleFilmCardClick() {
    this._showPopup();
  }

  _handlePopupCloseButtonClick() {
    this._hidePopup();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._hidePopup();
    }
  }
}
