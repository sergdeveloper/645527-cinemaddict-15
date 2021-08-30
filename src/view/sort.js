import Abstract from './abstract';

export const SortingType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const createSortingTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sorting-type="${SortingType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sorting-type="${SortingType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sorting-type="${SortingType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sorting extends Abstract {
  constructor() {
    super();

    this._sortingTypeChangeHandler = this._sortingTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortingTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortingTypeChange(evt.target.dataset.sortingType);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sortingTypeChange = callback;
    this.getElement().addEventListener('click', this._sortingTypeChangeHandler);
  }
}
