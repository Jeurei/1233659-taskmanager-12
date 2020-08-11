const QUANTITY_OF_TASKS = 20;
const TASKS_PER_STEP = 5;

import SiteControls from './view/site-controls.js';
import SiteFilters from './view/site-filters.js';
import SiteSort from './view/site-sort.js';
import SiteTask from './view/site-task.js';
import TaskEdit from './view/task-edit.js';
import LoadMoreButton from './view/load-more-button.js';
import SiteBoard from './view/site-board.js';
import TasksList from './view/tasks-list.js';
import SiteNoTasks from "./view/site-no-tasks.js";
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';
import {render, RenderPosition} from "./utils.js";


const tasks = new Array(QUANTITY_OF_TASKS).fill().map(generateTask);
const filters = generateFilter(tasks);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new SiteTask(task);
  const taskEditComponent = new TaskEdit(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) =>{
  const boardComponent = new SiteBoard();
  const tasksListComponent = new TasksList();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), tasksListComponent.getElement(), RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new SiteNoTasks().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SiteSort().getElement(), RenderPosition.BEFOREEND);

  render(boardComponent.getElement(), tasksListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(tasks.length, TASKS_PER_STEP); i++) {
    renderTask(tasksListComponent.getElement(), tasks[i]);
  }

  if (tasks.length > TASKS_PER_STEP) {
    let renderedTaskCount = TASKS_PER_STEP;

    render(boardComponent.getElement(), new LoadMoreButton().getElement(), RenderPosition.BEFOREEND);

    const loadMoreButton = boardComponent.getElement().querySelector(`.load-more`);

    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardTasks
      .slice(renderedTaskCount, renderedTaskCount + TASKS_PER_STEP)
      .forEach((task) => renderTask(tasksListComponent.getElement(), task));

      renderedTaskCount += TASKS_PER_STEP;

      if (renderedTaskCount >= tasks.length) {
        loadMoreButton.remove();
      }
    });
  }
};

render(siteHeaderElement, new SiteControls().getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new SiteFilters(filters).getElement(), RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
