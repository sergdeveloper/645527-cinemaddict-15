import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filter';
import MessageView from './view/system-message';
import SiteMenuView from './view/menu';
import StatsView from './view/statistics';
import UserProfileView from './view/user-profile';
import FooterStatisticView from './view/footer-stats';
import MovieListPresenter from './presenter/movies-list';
import FilterPresenter from './presenter/filter';
import {UpdateType, FilterType} from './update-filter-types';
import {remove, render, RenderPosition} from './utils/render';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
const MenuItem = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};
const ActivePageVariant = {
  MOVIES: 'movies',
  STATS: 'STATS',
};
const AUTHORIZATION = 'Basic l2or9kjk4pzt3lo';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();
const filtersModel = new FilterModel();
const commentsModel = new CommentsModel();
const noInternetMessage = new MessageView('No internet connection', 'notification--error');
const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');
render(siteHeader, new UserProfileView(moviesModel.getmovies()));
const siteMenuComponent = new SiteMenuView();
render(siteMain, siteMenuComponent);
const filterPresenter = new FilterPresenter(siteMenuComponent, moviesModel, filtersModel);
filterPresenter.init();
const movieListPresenter = new MovieListPresenter(siteHeader, siteMain, moviesModel, filtersModel, commentsModel, apiWithProvider);
movieListPresenter.init();
let currentActivePageVariant = ActivePageVariant.MOVIES;
let statsComponent = null;
const handleSiteMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS && currentActivePageVariant === ActivePageVariant.MOVIES) {
    currentActivePageVariant = ActivePageVariant.STATS;
    MovieListPresenter.destroy();
    filtersModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    statsComponent = new StatsView(moviesModel.getmovies());
    render(siteMain, statsComponent);
  } else if (menuItem !== MenuItem.STATS && currentActivePageVariant === ActivePageVariant.STATS) {
    currentActivePageVariant = ActivePageVariant.MOVIES;
    remove(statsComponent);
    MovieListPresenter.init();
    filtersModel.setFilter(UpdateType.MAJOR, FilterType[menuItem.toUpperCase()]);
  }
};
const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');
apiWithProvider.getmovies()
  .then((movies) => {
    moviesModel.setmovies(UpdateType.INIT, movies);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(footerStatisticsContainer, new FooterStatisticView(moviesModel.getmovies()));
  })
  .catch(() => {
    moviesModel.setmovies(UpdateType.INIT, []);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(footerStatisticsContainer, new FooterStatisticView(moviesModel.getmovies()));
  });
window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  siteBody.classList.remove('has-notification');
  remove(noInternetMessage);
  apiWithProvider.sync();
});
window.addEventListener('offline', () => {
  document.title += ' [offline]';
  siteBody.classList.add('has-notification');
  render(siteBody, noInternetMessage, RenderPosition.AFTERBEGIN);
});
