import {createElement} from '../utils.js';

const createSiteBoardContainer = () =>{
  return (`<section class="board container"></section>`);
};

export default class SiteBoard {

  constructor() {
    this._element = null;
  }

  getTemplate() {

    return createSiteBoardContainer();
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
