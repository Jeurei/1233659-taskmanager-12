import {createElement} from '../utils.js';

const createTasksList = () => {

  return (`<div class="board__tasks"></div>`);
};

export default class TasksList {

  constructor() {
    this._element = null;
  }

  getTemplate() {

    return createTasksList();
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
