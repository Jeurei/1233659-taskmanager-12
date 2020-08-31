import SiteSort from '../view/site-sort.js';
import TaskPresenter from "./task.js";
import LoadMoreButton from '../view/load-more-button.js';
import SiteBoard from '../view/site-board.js';
import TaskNewPresenter from "./task-new.js";
import TasksList from '../view/tasks-list.js';
import SiteNoTasks from "../view/site-no-tasks.js";
import {filter} from "../view/utils/filter.js";
import {render, RenderPosition, remove} from "../view/utils/render.js";
import {sortTaskUp, sortTaskDown} from "../view/utils/task.js";
import {SortType, UpdateType, UserAction} from "../const.js";

const TASKS_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel, filterModel) {
    this._boardContainer = boardContainer;
    this._taskPresenter = {};
    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;
    this._boardComponent = new SiteBoard();
    this._tasksListComponent = new TasksList();
    this._noTaskComponent = new SiteNoTasks();
    this._renderedTaskCount = TASKS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._taskNewPresenter = new TaskNewPresenter(this._tasksListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._tasksListComponent, RenderPosition.BEFOREEND);

    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._tasksListComponent);
    remove(this._boardComponent);

    this._tasksModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTask(callback) {
    this._taskNewPresenter.init(callback);
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filtredTasks = filter[filterType](tasks);

    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return filtredTasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return filtredTasks.sort(sortTaskDown);
    }
    return filtredTasks;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._tasksModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    this._taskNewPresenter.destroy();
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;
    this._taskNewPresenter.destroy();

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TASKS_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SiteSort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._tasksListComponent, this._handleViewAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((boardTask) => this._renderTask(boardTask));
  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASKS_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);
    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }
    this._loadMoreButtonComponent = new LoadMoreButton();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }
  _renderNoTask() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {

    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTask();
      return;
    }

    this._renderSort();

    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedTaskCount)));

    if (taskCount > this._renderedTaskCount) {
      this._renderLoadMoreButton();
    }
  }
}
