import State from '../types/state';
import { render } from './render';
import cache from '../application/cache';

const contentMainClassList = document.getElementById('content-main').classList;

const startLoading: ()=>void =
  function () {
    requestAnimationFrame(function() {
      contentMainClassList.remove('loaded');
      contentMainClassList.add('loading')
    })
  };

const finishLoading: ()=>void =
  function () {
    setTimeout(function() {
      requestAnimationFrame(function() {
        contentMainClassList.remove('loading')
        contentMainClassList.add('loaded');
      });
    }, 100);
  };

const transitionTo: (state: State, push?: boolean)=>Promise<any> =
  function (state: State, push?: boolean) {
    startLoading();
    return render(state, state.title, state.url).then(function() {
      finishLoading();
      if (push === undefined || push === null || !!push) {
        history.pushState(state, state.title, state.url);
      }
    });
  };

export default transitionTo;