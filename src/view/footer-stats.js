import Abstract from './abstract';
const createFooterStatsTemplate = (movies) => {`<p>${movies.length} movies inside</p>`;
};
export default class FooterStatistic extends Abstract {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {createFooterStatsTemplate(this._movies);
  }
}
