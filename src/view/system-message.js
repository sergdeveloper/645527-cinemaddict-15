import Abstract from './abstract';
const createMessageTemplate = (text, className = '') => {`<div class="notification ${className}">${text}</div>`;
};
export default class Message extends Abstract {
  constructor(text, className) {
    super();
    this._text = text;
    this._className = className;
  }

  getTemplate() {
    return createMessageTemplate(this._text, this._className);
  }
}
