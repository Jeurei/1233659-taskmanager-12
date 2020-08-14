import AbstractView from './abstract.js';

const createSiteBoardContainer = () =>{
  return (`<section class="board container"></section>`);
};

export default class SiteBoard extends AbstractView {
  getTemplate() {

    return createSiteBoardContainer();
  }

}
