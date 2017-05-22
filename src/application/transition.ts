import State from '../types/state';
import { render } from './render';

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

const transitionTo: (state: State, replace?: any, push?: any)=>Promise<any> =
  function (state, replace?, push?) {
    startLoading();
    if (replace === null || replace === undefined || !!replace) {
      history.replaceState(state, state.title, state.url);
    }
    return render(state, state.title, state.url).then(function() {
      finishLoading();
      if (push === null || push === undefined || !!push) {
        const currentState: State = history.state;
        if (currentState !== state) {
          setTimeout(function(_state: State) {
            history.pushState(_state, _state.title, _state.url);
          }, 250, state);
        }
      }
    });
  };

export default transitionTo;