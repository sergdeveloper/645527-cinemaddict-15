import ExtraMovieView from '../view/specialMovies';
import MovieListView from '../view/movies-list';
import LoadingScreenView from '../view/loading-screen';
import NoMovieView from '../view/empty-movies';
import ShowMoreButtonView from '../view/show-more-button';
import SortingView from '../view/sort';
import UserProfileView from '../view/user-profile';
import {filter} from '../utils/filter';
import MoviePresenter, {State as moviePresenterViewState, AbortingClassOfElement as moviePresenterAbortingClassOfElement} from './movie';
import {UpdateType} from '../update-filter-types';
import {getMostCommentedMovies, getTopRatedMovies, getSortedMoviesByDate, getSortedMoviesByRating} from '../utils/movie-func';
import {remove, render, RenderPosition} from '../utils/render';
const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_MOVIE: 'UPDATE_MOVIE',
};
const SortingType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
const ID_PREFIX = {
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};
const MOVIES_PER_STEP = 5;
export default class MovieList {
  constructor(userProfileContainer, movieListContainer, MoviesModel, FilterModel, CommentsModel, api) {
    this._loadingComponent = new LoadingScreenView();
    this._noMovieComponent = new NoMovieView();
    this._userProfileContainer = userProfileContainer;
    this._movieListContainer = movieListContainer;
    this._MoviesModel = MoviesModel;
    this._FilterModel = FilterModel;
    this._CommentsModel = CommentsModel;
    this._sortingComponent = null;
    this._userProfileComponent = null;
    this._movieListComponent = null;
    this._showMoreButtonComponent = null;
    this._mainMoviesList = null;
    this._mainMoviesContainer = null;
    this._topRatedMoviesComponent = null;
    this._mostCommentedMoviesComponent = null;
    this._moviePresenter = {};
    this._currentSortingType = SortingType.DEFAULT;
    this._renderedMovieCount = MOVIES_PER_STEP;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._isLoading = true;
    this._api = api;
  }

  init() {
    this._movieListComponent = new MovieListView();
    this._mainMoviesList = this._movieListComponent.getElement().querySelector('.films-list');
    this._mainMoviesContainer = this._mainMoviesList.querySelector('.films-list__container');
    this._MoviesModel.addObserver(this._handleModelEvent);
    this._FilterModel.addObserver(this._handleModelEvent);
    this._CommentsModel.addObserver(this._handleCommentModelEvent);
  }

  destroy() {
    this._clearMovieList({resetRenderedMovieCount: true, resetSortingType: true});
    remove(this._movieListComponent);
    this._mainMoviesList = null;
    this._mainMoviesContainer = null;
    this._MoviesModel.removeObserver(this._handleModelEvent);
    this._FilterModel.removeObserver(this._handleModelEvent);
    this._CommentsModel.removeObserver(this._handleCommentModelEvent);
  }

  _getMovies() {
    const filterType = this._FilterModel.getFilter();
    const movies = this._MoviesModel.getmovies();
    const filteredMovies = filter[filterType](movies);
    switch (this._currentSortingType) {
      case SortingType.DATE:
        return getSortedMoviesByDate(filteredMovies);
      case SortingType.RATING:
        return getSortedMoviesByRating(filteredMovies);
    }
    return filteredMovies;
  }

  _handleViewAction(userActionType, updateType, updateMovie, updateCommentId, updateComment) {
    switch (userActionType) {
      case UserAction.UPDATE_movie:
        this._api.updateMovie(updateMovie).then((response) => {
          this._MoviesModel.updateMovie(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._moviePresenter[updateMovie.id].setViewState(moviePresenterViewState.SAVING);
        this._api.addComment(updateMovie, updateComment)
          .then((response) => {
            this._CommentsModel.addComment(updateType, response);
          })
          .catch(() => {
            this._moviePresenter[updateMovie.id].setViewState(moviePresenterViewState.ABORTING, null, `.${moviePresenterAbortingClassOfElement.ADDING_COMMENT}`);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._moviePresenter[updateMovie.id].setViewState(moviePresenterViewState.DELETING, updateCommentId);
        this._api.deleteComment(updateCommentId)
          .then(() => {
            this._CommentsModel.deleteComment(updateType, updateMovie, updateCommentId);
          })
          .catch(() => {
            this._moviePresenter[updateMovie.id].setViewState(moviePresenterViewState.ABORTING, updateCommentId, `.${moviePresenterAbortingClassOfElement.REMOVING_COMMENT}[data-comment-id="${updateCommentId}"]`);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._renderUserProfile();
        if (data.id in this._moviePresenter) {
          this._moviePresenter[data.id].init(data);
        }
        if (`${ID_PREFIX.TOP_RATED}_${data.id}` in this._moviePresenter) {
          this._moviePresenter[`${ID_PREFIX.TOP_RATED}_${data.id}`].init(data);
        }
        if (`${ID_PREFIX.MOST_COMMENTED}_${data.id}` in this._moviePresenter) {
          this._moviePresenter[`${ID_PREFIX.MOST_COMMENTED}_${data.id}`].init(data);
        }
        break;
      case UpdateType.MINOR:
        this._renderUserProfile();
        this._clearMovieList();
        this._renderMovieList();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetRenderedMovieCount: true, resetSortingType: true});
        this._renderMovieList();
        break;
      case UpdateType.INIT:
        this._renderUserProfile();
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMovieList();
        break;
      case UpdateType.COMMENT:
        if (data.id in this._moviePresenter) {
          this._moviePresenter[data.id].init(data, true);
        }
        break;
    }
  }

  _handleCommentModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._MoviesModel.updateMovie(updateType, data);
        break;
      case UpdateType.MINOR:
        this._MoviesModel.updateMovie(updateType, data);
        break;
      case UpdateType.MAJOR:
        this._MoviesModel.updateMovie(updateType, data);
        break;
      case UpdateType.COMMENT:
        this._MoviesModel.updateMovie(updateType, data);
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortingTypeChange(sortingType) {
    if (sortingType === this._currentSortingType) {
      return;
    }
    this._currentSortingType = sortingType;
    this._clearMovieList({resetRenderedMovieCount: true});
    this._renderMovieList();
  }

  _renderUserProfile() {
    if (this._userProfileComponent) {
      remove(this._userProfileComponent);
      this._userProfileComponent = null;
    }
    this._userProfileComponent = new UserProfileView(this._MoviesModel.getmovies());
    render(this._userProfileContainer, this._userProfileComponent);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }
    this._sortingComponent = new SortingView(this._currentSortingType);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
    render(this._movieListComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderLoading() {
    render(this._movieListContainer, this._loadingComponent);
  }

  _renderMovies(movies, container, prefix = '') {
    movies.forEach((movie) => this._renderMovie(container, movie, prefix));
  }

  _renderMainMovies(movies) {
    this._renderMovies(movies, this._mainMoviesContainer);
  }

  _renderExtraMovies() {
    const topRatedMovies = getTopRatedMovies(this._MoviesModel.getmovies());
    const mostCommentedMovies = getMostCommentedMovies(this._MoviesModel.getmovies());
    if (topRatedMovies.every((movie) => movie.movieInfo.totalRating > 0)) {
      this._topRatedMoviesComponent = new ExtraMovieView('topRated', 'Top rated');
      render(this._movieListComponent, this._topRatedMoviesComponent);
      const topRatedMoviesContainer = this._topRatedMoviesComponent.getElement().querySelector('.films-list__container');
      this._renderMovies(topRatedMovies, topRatedMoviesContainer, ID_PREFIX.TOP_RATED);
    }
    if (mostCommentedMovies.every((movie) => movie.comments.length > 0)) {
      this._mostCommentedMoviesComponent = new ExtraMovieView('mostCommented', 'Most commented');
      render(this._movieListComponent, this._mostCommentedMoviesComponent);
      const mostCommentedMoviesContainer = this._mostCommentedMoviesComponent.getElement().querySelector('.films-list__container');
      this._renderMovies(mostCommentedMovies, mostCommentedMoviesContainer, ID_PREFIX.MOST_COMMENTED);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._mainMoviesList, this._showMoreButtonComponent);
  }

  _handleShowMoreButtonClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount + MOVIES_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);
    this._renderMovies(movies, this._mainMoviesContainer);
    this._renderedMovieCount = newRenderedMovieCount;
    if (this._renderedMovieCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderNoMovie() {
    render(this._movieListContainer, this._noMovieComponent);
  }

  _renderMovieList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const movies = this._getMovies();
    const movieCount = movies.length;
    if (movieCount === 0) {
      this._renderNoMovie();
      return;
    }
    render(this._movieListContainer, this._movieListComponent);
    this._renderSorting();
    this._renderMainMovies(movies.slice(0, Math.min(movieCount, this._renderedMovieCount)));
    if (movieCount > MOVIES_PER_STEP) {
      this._renderShowMoreButton();
    }
    this._renderExtraMovies();
  }

  _renderMovie(container, movie, prefix = '') {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handleModeChange, this._FilterModel, this._CommentsModel, this._api);
    this._moviePresenter[prefix ? `${prefix}_${movie.id}` : movie.id] = moviePresenter;
    return moviePresenter.init(movie);
  }

  _clearMovieList({resetRenderedMovieCount = false, resetSortingType = false} = {}) {
    const movieCount = this._getMovies().length;
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    remove(this._sortingComponent);
    remove(this._loadingComponent);
    remove(this._noMovieComponent);
    remove(this._showMoreButtonComponent);
    remove(this._topRatedMoviesComponent);
    remove(this._mostCommentedMoviesComponent);
    this._topRatedMoviesComponent = null;
    this._mostCommentedMoviesComponent = null;
    if (resetRenderedMovieCount) {
      this._renderedMovieCount = MOVIES_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
    }
    if (resetSortingType) {
      this._currentSortingType = SortingType.DEFAULT;
    }
  }
}
