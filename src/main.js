import {render, RenderPosition} from './utils/render.js';
import UserProfileTemplateView from './view/user-profile.js';
import FooterStatsTemplateView from './view/footer-stats.js';
import { generateMovie } from './mock/movie.js';
import FilterView from './view/filter.js';
import MenuTemplateView from './view/menu.js';
import FilmListPresenter from './presenter/movies-list.js';
import { getRandomInteger } from './utils/common.js';
const CARDS_COUNT = 25;

const movies = new Array(CARDS_COUNT).fill().map(generateMovie);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector ('.footer');
const siteFooterStatistics = siteFooterElement.querySelector ('.footer__statistics');


render (siteHeaderElement, new UserProfileTemplateView, RenderPosition.BEFOREEND);
const siteMenuComponent = new MenuTemplateView();

const filmToFilterMap = {
  all: () => null,
  watchlist: (movies) => movies.filter((singleMovie) => singleMovie.user_details.watchlist).length+getRandomInteger(5, 20),
  history: (movies) => movies.filter((singleMovie) => singleMovie.user_details.alreadyWatched).length+getRandomInteger(5, 20),
  favorites: (movies) => movies.filter((singleMovie) => singleMovie.user_details.favorite).length+getRandomInteger(5, 20),
};

const generateFilter = (movies) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(movies),
    };
  });
};

const filters = generateFilter(movies);

render(siteMainElement, siteMenuComponent);
render(siteMenuComponent, new FilterView(filters), RenderPosition.AFTERBEGIN);
const filmListPresenter = new FilmListPresenter(siteMainElement);
filmListPresenter.init(movies);

render (siteFooterStatistics, new FooterStatsTemplateView(movies.length), RenderPosition.BEFOREEND);
