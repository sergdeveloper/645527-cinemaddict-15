import Abstract from './abstract';


const createSpecialMovieTemplate = (id, title) => {
  return `<section class="films-list films-list--extra" id="${id}">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;
};

export default class SpecialMovie extends Abstract {
  constructor(id, title) {
    super();
    this._id = id;
    this._title = title;
  }

  getTemplate() {
    return createSpecialMovieTemplate(this._id, this._title);
  }
}
