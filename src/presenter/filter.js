import FilterView from '../view/filter.js';
import {FilterType, UpdateType} from '../update-filter-types.js';
import {RenderPosition, remove, render, replace} from '../utils/render.js';
import {filter} from '../utils/filter.js';
export default class Filter {
  constructor(filterContainer, MoviesModel, FilterModel) {
    this._filterContainer = filterContainer;
    this._MoviesModel = MoviesModel;
    this._FilterModel = FilterModel;
    this._filterComponent = null;
    this._MoviesModel.addObserver(this._handleModelEvent);
    this._FilterModel.addObserver(this._handleModelEvent);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._FilterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterTypeChange(filterType) {
    if (this._FilterModel.getFilter() === filterType) {
      return;
    }
    this._FilterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const movies = this._MoviesModel.getmovies();
    return [
      {
        count: filter[FilterType.ALL](movies).length,
        name: 'All movies',
        type: FilterType.ALL,
      },
      {
        count: filter[FilterType.WATCHLIST](movies).length,
        name: 'Watchlist',
        type: FilterType.WATCHLIST,
      },
      {
        count: filter[FilterType.HISTORY](movies).length,
        name: 'History',
        type: FilterType.HISTORY,
      },
      {
        count: filter[FilterType.FAVORITES](movies).length,
        name: 'Favorites',
        type: FilterType.FAVORITES,
      },
    ];
  }
}
