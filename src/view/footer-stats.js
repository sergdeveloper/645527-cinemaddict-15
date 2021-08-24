import AbstractView from './abstract.js';

const createFooterStatsTemplate = (count) => {
  return `<p>
    ${count} movies inside
  </p>`;
};

export default class FooterStatsTemplate extends AbstractView {
  constructor(singleMovie) {
    super();
    this._singleMovie = singleMovie;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._singleMovie);
  }
}
