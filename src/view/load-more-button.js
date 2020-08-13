import {createElement} from '../utils.js';

const createSiteLoadMoreButton = () => {

  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadMoreButton {

  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteLoadMoreButton();
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
