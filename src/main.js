const QUANTITY_OF_TASKS = 3;

import {createSiteControls} from './view/siteControls.js';
import {createSiteFilters} from './view/siteFilters.js';
import {createSiteSort} from './view/siteSort.js';
import {createSiteTask} from './view/siteTask.js';
import {createTaskEdit} from './view/taskEdit.js';
import {createSiteLoadMoreButton} from './view/loadMoreButton.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteControls(), `beforeend`);

render(siteMainElement, createSiteFilters(), `beforeend`);

render(siteMainElement, createSiteSort(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement =
boardElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEdit(), `beforeend`);

for (let i = 0; i < QUANTITY_OF_TASKS; i++) {
  render(taskListElement, createSiteTask(), `beforeend`);
}

render(boardElement, createSiteLoadMoreButton(), `beforeend`);
