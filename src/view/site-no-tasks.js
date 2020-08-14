import AbstractView from './abstract.js';

const creatSiteNoTask = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class SiteNoTasks extends AbstractView {
  getTemplate() {
    return creatSiteNoTask();
  }

}
