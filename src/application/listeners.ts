import { clickHandler, columnToggleHandler, submitHandler } from './handlers';
import State from '../types/state';
import transitionTo from './transition';
import cache from '../application/cache';

const columnCtrl = document.getElementById('column-ctrl');

export function setupColumnControlListener(): void {
  columnCtrl.addEventListener('click', columnToggleHandler);
}

export function teardownEventListeners(): void {
  const anchors = document.querySelectorAll('a.js-nav');
  for (let i = 0; i < anchors.length; i++) {
    anchors[i].removeEventListener('click', clickHandler);
  }
}

export function setupEventListeners(): void {
  const anchors = document.querySelectorAll('a.js-nav');
  for (let i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', clickHandler);
  }
}

export function setupFormListeners(): void {
  document.getElementById('search').addEventListener('submit', submitHandler);
}

export function setupHistoryListener(): void {
  window.onpopstate = function(evt) {
    const state: State = evt.state;
    if (!state) {
      return;
    }
    transitionTo(state, false);
  };
}
