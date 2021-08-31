import NoMovieView from '../view/empty-films.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import MoviesListView from '../view/movies-list.js';
import SpecialMovieView from '../view/specialMovies.js';
import {getMostCommentedMovies, getTopRatedMovies, getSortedMoviesByDate, getSortedMoviesByRating} from '../utils/movies-stats.js';
import SortingView from '../view/sort.js';
import { updateItem } from '../utils/common.js';
import { SortingType } from '../view/sort.js';


const CARDS_PER_STEP = 5;

const ID_PREFIX = {
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};


import FilmPresenter from './movie.js';

import {remove, render, RenderPosition} from '../utils/render';


export default class FilmList {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;
    this._sortingComponent = new SortingView();
    this._filmListComponent = new MoviesListView();
    this._noFilmComponent = new NoMovieView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._mainFilmsList = this._filmListComponent.getElement().querySelector('.films-list');
    this._mainFilmsContainer = this._mainFilmsList.querySelector('.films-list__container');

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._currentSortingType = SortingType.DEFAULT;

    this._filmPresenter = {};
    this._renderedFilmCount = CARDS_PER_STEP;
    this._films = null;
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
  }

  init(films) {
    this._sourcedFilms = films.slice();
    this._films = films.slice();

    render(this._filmListContainer, this._filmListComponent);

    this._topRatedFilms = getTopRatedMovies(this._films);
    this._mostCommentedFilms = getMostCommentedMovies(this._films);

    if (this._topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
      render(this._filmListComponent, new SpecialMovieView('topRated', 'Top rated'));
    }

    if (this._mostCommentedFilms.every((film) => film.comments.length > 0)) {
      render(this._filmListComponent, new SpecialMovieView('mostCommented', 'Most commented'));
    }

    this._renderFilmList();
  }

  _sortFilms(sortingType) {
    switch (sortingType) {
      case SortingType.DATE:
        this._films = getSortedMoviesByDate(this._films);
        break;
      case SortingType.RATING:

        this._films = getSortedMoviesByRating(this._films);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortingType = sortingType;
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);

    if (`${ID_PREFIX.TOP_RATED}_${updatedFilm.id}` in this._filmPresenter) {
      this._filmPresenter[`${ID_PREFIX.TOP_RATED}_${updatedFilm.id}`].init(updatedFilm);
    }

    if (`${ID_PREFIX.MOST_COMMENTED}_${updatedFilm.id}` in this._filmPresenter) {
      this._filmPresenter[`${ID_PREFIX.MOST_COMMENTED}_${updatedFilm.id}`].init(updatedFilm);
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortingTypeChange(sortingType) {
    if (sortingType === this._currentSortingType) {
      return;
    }

    this._sortFilms(sortingType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderNoFilm() {
    render(this._filmListContainer, this._noFilmComponent);
  }

  _renderSorting() {
    render(this._filmListComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
  }

  _renderFilm(container, film, prefix='') {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);

    this._filmPresenter[prefix ? `${prefix}_${film.id}` : film.id] = filmPresenter;
  }

  _renderFilms(films, container, prefix = '', from = 0, to = films.length) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film, prefix));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._films, this._mainFilmsContainer, '', this._renderedFilmCount, this._renderedFilmCount + CARDS_PER_STEP);
    this._renderedFilmCount += CARDS_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._mainFilmsList, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMainFilms() {
    this._renderFilms(this._films, this._mainFilmsContainer, '', 0, Math.min(this._films.length, CARDS_PER_STEP));
  }

  _renderSpecialMovies() {

    this._topRatedFilms = getTopRatedMovies(this._films);
    this._mostCommentedFilms = getMostCommentedMovies(this._films);
    const topRatedFilms = getTopRatedMovies(this._films);
    const mostCommentedFilms = getMostCommentedMovies(this._films);

    if (topRatedFilms.every((film) => film.filmInfo.total_rating > 0)) {
      render(this._filmListComponent, new SpecialMovieView('topRated', 'Top rated'));

      const topRatedFilmsContainer = this._filmListComponent.getElement().querySelector('#topRated').querySelector('.films-list__container');

      this._renderFilms(topRatedFilms, topRatedFilmsContainer, ID_PREFIX.TOP_RATED);
    }

    if (mostCommentedFilms.every((film) => film.comments.length > 3)) {
      render(this._filmListComponent, new SpecialMovieView('mostCommented', 'Most commented'));

      const mostCommentedFilmsContainer = this._filmListComponent.getElement().querySelector('#mostCommented').querySelector('.films-list__container');

      this._renderFilms(mostCommentedFilms, mostCommentedFilmsContainer, ID_PREFIX.MOST_COMMENTED);
    }
  }

  _renderFilmList() {

    if (this._films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderSorting();
    this._renderMainFilms();

    if (this._films.length > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
    this._renderSpecialMovies();
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = CARDS_PER_STEP;

    remove(this._showMoreButtonComponent);
  }
}
