import Observer from '../utils/observer';
import {FilterType} from '../update-filter-types';
export default class Filter extends Observer {
  constructor() {
    super();
    this._currentFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._currentFilter;
  }
}
