import {createElement} from '../utils/render';
const SHAKE_ANIMATION_TIMEOUT = 600;
export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Cant instantiate Abstract');
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented');
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

  shake(callback, shakingElementSelector) {
    const element = shakingElementSelector ? this.getElement().querySelector(shakingElementSelector) : this.getElement();
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
