import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateElement(scrollTop) {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
    if (scrollTop) {
      this.getElement().scrollTop = scrollTop;
    }
  }

  updateData(update, onlyDataUpdate = false, scrollTop = 0) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
      {},
      this._data,
      update,
    );
    if (onlyDataUpdate) {
      return;
    }
    this.updateElement(scrollTop);
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
