import { clickHandler, columnToggleHandler, submitHandler } from './handlers';
import State from '../types/state';
import transitionTo from './transition';

const columnCtrl = document.getElementById('column-ctrl');

export function setupColumnControlListener(): void {
  columnCtrl.addEventListener('click', columnToggleHandler);
}

export function teardownEventListeners(): void {
  var anchors = document.querySelectorAll('a.js-nav');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].removeEventListener('click', clickHandler);
  }
}

export function setupEventListeners(): void {
  var anchors = document.querySelectorAll('a.js-nav');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', clickHandler);
  }
}

export function setupFormListeners(): void {
  document.getElementById('search').addEventListener('submit', submitHandler);
}

export function setupHistoryListener(): void {
  window.onpopstate = function(evt) {
    const state: State = evt.state;
    if (state) {
      transitionTo(state, false, false);
    }
  };
}
