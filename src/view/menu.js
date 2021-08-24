import AbstractView from './abstract.js';

const createMenuTemplate = (watchList, history, favorite) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`
);


export default class MenuTemplate extends AbstractView{
  constructor(alreadyWatchedCount,favoriteCount, watchListCount) {
    super();
    this._alreadyWatchedCount = alreadyWatchedCount;
    this._favoriteCount = favoriteCount;
    this._watchListCount = watchListCount;
  }

  getTemplate() {
    return createMenuTemplate(this._alreadyWatchedCount, this._favoriteCount, this._watchListCount);
  }
}
