import { createMenuTemplate } from './view/menu.js';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMoviesListTemplate } from './view/movies-list.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { generateMovie } from './mock/movie.js';
import { createPopupMovieTemplate } from './view/popup.js';

const CARDS_COUNT = 25;
const CARDS_PER_STEP = 5;
const CARDS_COUNT_SPECIAL = 2;
const movies = new Array(CARDS_COUNT).fill().map(generateMovie);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector ('.footer');
const siteFooterStatistics = siteFooterElement.querySelector ('.footer__statistics');

const alreadyWatchedCount = movies.filter((e) => {return e.user_details.already_watched === true;});
const favoriteCount = movies.filter((e) =>  {return e.user_details.favorite === true;});
const watchListCount = movies.filter((e) =>  {return e.user_details.watchlist === true;});

render (siteHeaderElement, createUserProfileTemplate(), 'beforeend');
render (siteMainElement, createMenuTemplate(alreadyWatchedCount,favoriteCount, watchListCount), 'beforeend');
render (siteMainElement, createMoviesListTemplate(), 'beforeend');
const moviesList = siteMainElement.querySelector('.films-list');
const moviesListContainer = siteMainElement.querySelector('.films-list__container');
const moviesListContainerRated = siteMainElement.querySelector('.films-list__container--rated');
const moviesListContainerCommented = siteMainElement.querySelector('.films-list__container--commented');

for (let i = 0; i < Math.min(movies.length, CARDS_PER_STEP); i++) {
  render (moviesListContainer, createMovieCardTemplate(movies[i]), 'beforeend');
}

render (siteMainElement, createPopupMovieTemplate(movies[0]), 'beforeend');

if (movies.length > CARDS_PER_STEP) {
  render (moviesList, createShowMoreButtonTemplate(), 'beforeend');
  let renderedMoviesCount = CARDS_PER_STEP;
  const showMoreButton = document.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMoviesCount, renderedMoviesCount + CARDS_PER_STEP)
      .forEach((singleMovie) => render(moviesListContainer, createMovieCardTemplate(singleMovie), 'beforeend'));

    renderedMoviesCount += CARDS_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerRated, createMovieCardTemplate(movies[i]), 'beforeend');
}
for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerCommented, createMovieCardTemplate(movies[i]), 'beforeend');
}
render (siteFooterStatistics, createFooterStatsTemplate(movies.length), 'beforeend');

export{render, movies};
