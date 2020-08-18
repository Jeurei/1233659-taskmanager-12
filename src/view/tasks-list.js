import AbstractView from './abstract.js';

const createTasksList = () => {

  return (`<div class="board__tasks"></div>`);
};

export default class TasksList extends AbstractView {
  getTemplate() {

    return createTasksList();
  }


}
