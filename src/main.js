import {render, RenderPosition} from './utils/render.js';
import UserProfileTemplateView from './view/user-profile.js';
import MenuTemplateView from './view/menu.js';
import MoviesListView from './view/movies-list.js';
import MovieCardView from './view/movie-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FooterStatsTemplateView from './view/footer-stats.js';
import MoviePopupView from './view/popup.js';
import EmptyFilmsView from './view/empty-films.js';
import { generateMovie } from './mock/movie.js';

const CARDS_COUNT = 25;
const CARDS_PER_STEP = 5;
const CARDS_COUNT_SPECIAL = 2;
const movies = new Array(CARDS_COUNT).fill().map(generateMovie);

const siteBody = document.body;
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector ('.footer');
const siteFooterStatistics = siteFooterElement.querySelector ('.footer__statistics');

const alreadyWatchedCount = movies.filter((e) => {return e.user_details.already_watched === true;});
const favoriteCount = movies.filter((e) =>  {return e.user_details.favorite === true;});
const watchListCount = movies.filter((e) =>  {return e.user_details.watchlist === true;});

render(siteHeaderElement, new UserProfileTemplateView(), RenderPosition.BEFOREEND);
render(siteMainElement, new MenuTemplateView(alreadyWatchedCount,favoriteCount, watchListCount), RenderPosition.BEFOREEND);
render(siteMainElement, new MoviesListView(), RenderPosition.BEFOREEND);

const moviesList = siteMainElement.querySelector('.films-list');
const moviesListContainer = siteMainElement.querySelector('.films-list__container');
const moviesListContainerRated = siteMainElement.querySelector('.films-list__container--rated');
const moviesListContainerCommented = siteMainElement.querySelector('.films-list__container--commented');

const renderMovie = (container, movie) => {
  const movieComponent = new MovieCardView(movie);
  const moviePopupComponent = new MoviePopupView(movie);
  const popupCloseButton = moviePopupComponent.getElement().querySelector('.film-details__close-btn');

  const showPopup = () => {
    siteBody.appendChild(moviePopupComponent.getElement());
    popupCloseButton.addEventListener('click', onPopupCloseClick);
    moviePopupComponent.setCloseButtonClickHandler(onPopupCloseClick);
    document.addEventListener('keydown', onEscKeyDown);
    movieComponent.getElement().removeEventListener('click', onMovieClick);
  };

  const hidePopup = () => {
    siteBody.classList.remove('hide-overflow');
    siteBody.removeChild(moviePopupComponent.getElement());

    document.removeEventListener('keydown', onEscKeyDown);

    movieComponent.setOpenPopupClickHandler(onMovieClick);
  };

  const shopPopupClick = () => {
    movieComponent.getElement().querySelector('.film-card').addEventListener('click', () => {
      showPopup();
    });
  };

  const onMovieClick = () => {
    showPopup();
  };

  const onPopupCloseClick = () => {
    hidePopup();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();

      popupCloseButton.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onEscKeyDown);

      movieComponent.getElement().addEventListener('click', onMovieClick);
    }
  };

  movieComponent.setOpenPopupClickHandler(onMovieClick);

  render(moviesListContainer, movieComponent, RenderPosition.BEFOREEND);
};


const renderAllMovies = ()=>{

  if (movies.length === 0) {
    render(siteMainElement, new EmptyFilmsView(), RenderPosition.BEFOREEND);
    return;
  }

for (let i = 0; i < Math.min(movies.length, CARDS_PER_STEP); i++) {
  renderMovie(moviesListContainer, movies[i]);
}

if (movies.length > CARDS_PER_STEP) {
  render (moviesList, new ShowMoreButtonView(), RenderPosition.BEFOREEND);
  let renderedMoviesCount = CARDS_PER_STEP;
  const showMoreButton = document.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMoviesCount, renderedMoviesCount + CARDS_PER_STEP)
      .forEach((singleMovie) => renderMovie(moviesListContainer, singleMovie));

    renderedMoviesCount += CARDS_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      showMoreButton.remove();
    }
  });
  new ShowMoreButtonView().setClickHandler(showMoreButton);
}

for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerCommented, new MovieCardView(movies[i]), RenderPosition.BEFOREEND);
}
for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerRated, new MovieCardView(movies[i]), RenderPosition.BEFOREEND);
}
}

renderAllMovies();
render (siteFooterStatistics, new FooterStatsTemplateView(movies.length), RenderPosition.BEFOREEND);
