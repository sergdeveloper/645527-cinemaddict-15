import {renderElement, RenderPosition} from './utils.js';
import UserProfileTemplateView from './view/user-profile.js';
import MenuTemplateView from './view/menu.js';
import MoviesListView from './view/movies-list.js';
import MovieCardView from './view/movie-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FooterStatsTemplateView from './view/footer-stats.js';
import MoviePopupView from './view/popup.js';
import { generateMovie } from './mock/movie.js';


const CARDS_COUNT = 25;
const CARDS_PER_STEP = 5;
const CARDS_COUNT_SPECIAL = 2;
const POPUP_OPEN_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];
const movies = new Array(CARDS_COUNT).fill().map(generateMovie);


const siteBody = document.body;
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector ('.footer');
const siteFooterStatistics = siteFooterElement.querySelector ('.footer__statistics');

const alreadyWatchedCount = movies.filter((e) => {return e.user_details.already_watched === true;});
const favoriteCount = movies.filter((e) =>  {return e.user_details.favorite === true;});
const watchListCount = movies.filter((e) =>  {return e.user_details.watchlist === true;});

renderElement(siteHeaderElement, new UserProfileTemplateView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new MenuTemplateView(alreadyWatchedCount,favoriteCount, watchListCount).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new MoviesListView().getElement(), RenderPosition.BEFOREEND);

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
    document.addEventListener('keydown', onEscKeyDown);
    movieComponent.getElement().removeEventListener('click', onMovieClick);
  };

  const hidePopup = () => {
    siteBody.classList.remove('hide-overflow');
    siteBody.removeChild(moviePopupComponent.getElement());

    document.removeEventListener('keydown', onEscKeyDown);

    movieComponent.getElement().addEventListener('click', onMovieClick);
  };

  const shopPopupClick = () => {
    movieComponent.getElement().querySelector('.film-card').addEventListener('click', () => {
      showPopup();
    });
  };

  const onMovieClick = (evt) => {
    if (!POPUP_OPEN_CLASSES.includes(evt.target.className)) {
      return;
    }

    evt.preventDefault();
    showPopup();
  };

  const onPopupCloseClick = (evt) => {
    evt.preventDefault();
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

  movieComponent.getElement().addEventListener('click', onMovieClick);

  renderElement(moviesListContainer, movieComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(movies.length, CARDS_PER_STEP); i++) {
  renderMovie(moviesListContainer, movies[i]);
}

if (movies.length > CARDS_PER_STEP) {
  renderElement (moviesList, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);
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
}

for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  renderElement (moviesListContainerCommented, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}
for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  renderElement (moviesListContainerRated, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}

renderElement (siteFooterStatistics, new FooterStatsTemplateView(movies.length).getElement(), RenderPosition.BEFOREEND);
