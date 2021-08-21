import {createElement} from '../utils.js';

const createFooterStatsTemplate = (count) => {
  return `<p>
    ${count} movies inside
  </p>`;
};

export default class FooterStatsTemplate {
  constructor(singleMovie) {
    this._singleMovie = singleMovie;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._singleMovie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
