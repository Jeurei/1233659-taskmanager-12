const QUANTITY_OF_TASKS = 20;
const TASKS_PER_STEP = 5;

import {createSiteControls} from './view/site-controls.js';
import {createSiteFilters} from './view/site-filters.js';
import {createSiteSort} from './view/site-sort.js';
import {createSiteTask} from './view/site-task.js';
import {createTaskEdit} from './view/task-edit.js';
import {createSiteLoadMoreButton} from './view/load-more-button.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tasks = new Array(QUANTITY_OF_TASKS).fill().map(generateTask);
const filters = generateFilter(tasks);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteControls(), `beforeend`);

render(siteMainElement, createSiteFilters(filters), `beforeend`);

render(siteMainElement, createSiteSort(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEdit(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASKS_PER_STEP); i++) {
  render(taskListElement, createSiteTask(tasks[i]), `beforeend`);
}


if (tasks.length > TASKS_PER_STEP) {
  let renderedTaskCount = TASKS_PER_STEP;

  render(boardElement, createSiteLoadMoreButton(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASKS_PER_STEP)
      .forEach((task) => render(taskListElement, createSiteTask(task), `beforeend`));

    renderedTaskCount += TASKS_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
