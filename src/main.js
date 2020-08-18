const QUANTITY_OF_TASKS = 20;

import SiteControls from './view/site-controls.js';
import SiteFilters from './view/site-filters.js';
import Board from './presenter/board.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';
import {render, RenderPosition} from "./view/utils/render.js";


const tasks = new Array(QUANTITY_OF_TASKS).fill().map(generateTask);
const filters = generateFilter(tasks);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const boardPresenter = new Board(siteMainElement);

render(siteHeaderElement, new SiteControls(), RenderPosition.BEFOREEND);

render(siteMainElement, new SiteFilters(filters), RenderPosition.BEFOREEND);

boardPresenter.init(tasks);
