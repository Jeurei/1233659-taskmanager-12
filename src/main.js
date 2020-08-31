const QUANTITY_OF_TASKS = 20;

import SiteControls from './view/site-controls.js';
import Board from './presenter/board.js';
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import StatisticsView from "./view/statistics.js";
import {generateTask} from './mock/task.js';
import {render, RenderPosition, remove} from "./view/utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";


const tasks = new Array(QUANTITY_OF_TASKS).fill().map(generateTask);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);
const filterModel = new FilterModel();
let statisticsComponent = null;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteControls();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const boardPresenter = new Board(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);


const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      remove(statisticsComponent);
      boardPresenter.init();
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
