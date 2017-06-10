import transitionTo from './transition';
import State from '../types/state';

export function submitHandler(evt): void {
  const el: HTMLInputElement | any = document.getElementById('query');
  const q: string = el.value;
  const search: string = encodeURI('?search=' + q);
  const url: string = location.origin + '/' + search;
  const title: string = 'Search: ' + q;
  const state: State = { page: url, title: title, url: url };
  transitionTo(state);
  evt.preventDefault();
  evt.stopImmediatePropagation();
}

export function clickHandler(evt: Event): void {
  let el: HTMLAnchorElement | any = evt.target;
  if (el.tagName !== 'A') {
    el = el.parentElement;
  }
  const url: string = el.href;
  const title: string = el.innerText;
  const state: State = { page: el.href, title: title, url: url };
  transitionTo(state);
  evt.preventDefault();
  evt.stopImmediatePropagation();
}

const columnCtrl = document.getElementById('column-ctrl');
const blogBody = document.getElementById('blog-body');
const blogContent = document.getElementById('blog-content');
const blogNav = document.getElementById('blog-nav');

export function columnToggleHandler(): void {
  let classList: DOMTokenList = columnCtrl.classList;
  if (classList.contains('js-two')) {
    classList.remove('js-two');
    columnCtrl.innerText = 'Two column';
  } else {
    classList.add('js-two');
    columnCtrl.innerText = 'One column'
  }
  classList = blogBody.classList;
  if (classList.contains('Blog-body--two-col')) {
    classList.remove('Blog-body--two-col');
  } else {
    classList.add('Blog-body--two-col');
  }
  classList = blogContent.classList;
  if (classList.contains('Blog-content--two-col')) {
    classList.remove('Blog-content--two-col');
  } else {
    classList.add('Blog-content--two-col');
  }
  classList = blogNav.classList;
  if (classList.contains('Blog-nav--two-col')) {
    classList.remove('Blog-nav--two-col');
  } else {
    classList.add('Blog-nav--two-col');
  }
}