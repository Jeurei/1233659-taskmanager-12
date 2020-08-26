import SiteSort from '../view/site-sort.js';
import TaskPresenter from "./task.js";
import LoadMoreButton from '../view/load-more-button.js';
import SiteBoard from '../view/site-board.js';
import TasksList from '../view/tasks-list.js';
import SiteNoTasks from "../view/site-no-tasks.js";
import {updateItem} from "../view/utils/common.js";
import {render, RenderPosition, remove} from "../view/utils/render.js";
import {sortTaskUp, sortTaskDown} from "../view/utils/task.js";
import {SortType} from "../const.js";

const TASKS_PER_STEP = 5;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._taskPresenter = {};
    this._boardComponent = new SiteBoard();
    this._sortComponent = new SiteSort();
    this._tasksListComponent = new TasksList();
    this._noTaskComponent = new SiteNoTasks();
    this._renderedTaskCount = TASKS_PER_STEP;
    this._currenSortType = SortType.DEFAULT;
    this._loadMoreButtonComponent = new LoadMoreButton();
    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = [...boardTasks];
    this._sourcedBoardTasks = [...boardTasks];

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._tasksListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }


  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currenSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _clearTaskList() {
    this._tasksListComponent.getElement().innerHTML = ``;
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASKS_PER_STEP;
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._tasksListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(from, to) {
    this._boardTasks
    .slice(from, to)
    .forEach((boardTask) => this._renderTask(boardTask));
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASKS_PER_STEP);
    this._renderedTaskCount += TASKS_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }
  _renderNoTask() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASKS_PER_STEP));

    if (this._boardTasks.length > TASKS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {

    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTask();
      return;
    }

    this._renderSort();

    this._renderTaskList();
  }
}
