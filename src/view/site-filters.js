import {createElement} from '../utils.js';

const createSiteFilterItem = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createSiteFilters = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createSiteFilterItem(filter, index === 0))
    .join(``);

  return `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`;
};

export default class SiteFilters {


  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createSiteFilters(this._filters);
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
