import { createMenuTemplate } from './view/menu.js';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMoviesListTemplate } from './view/movies-list.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';

const CARDS_COUNT = 5;
const CARDS_COUNT_SPECIAL = 2;
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector ('.footer');
const siteFooterStatistics = siteFooterElement.querySelector ('.footer__statistics');

render (siteHeaderElement, createUserProfileTemplate(), 'beforeend');
render (siteMainElement, createMenuTemplate(), 'beforeend');
render (siteMainElement, createMoviesListTemplate(), 'beforeend');
const moviesList = siteMainElement.querySelector('.films-list');
const moviesListContainer = siteMainElement.querySelector('.films-list__container');
const moviesListContainerRated = siteMainElement.querySelector('.films-list__container--rated');
const moviesListContainerCommented = siteMainElement.querySelector('.films-list__container--commented');

for (let i = 0; i < CARDS_COUNT; i++) {
  render (moviesListContainer, createMovieCardTemplate(), 'beforeend');
}
render (moviesList, createShowMoreButtonTemplate(), 'beforeend');
for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerRated, createMovieCardTemplate(), 'beforeend');
}
for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render (moviesListContainerCommented, createMovieCardTemplate(), 'beforeend');
}
render (siteFooterStatistics, createFooterStatsTemplate(), 'beforeend');
