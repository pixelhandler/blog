import postsRepo from '../repositories/posts';
import Resources from '../types/resources';
import Record from '../types/record';
import Post from '../types/post';
import ExpertsComponent from './excerpts';

const resetForm: ()=>void =
  function (): void {
    const input: HTMLInputElement | any = document.getElementById('query');
    input.value = '';
  };

declare var Promise: any;

const render: (q: string)=>Promise<any> =
  function (query: string): Promise<any> {
    return new Promise(function(resolve: Function, reject?: Function) {
      if (query === '') {
        postsRepo.getPosts().then(function(posts: Array<Record>) {
          ExpertsComponent.render(posts);
          resolve();
        });
      } else {
        postsRepo.searchPosts(query, function(posts: Array<Record>) {
          renderResults(query, posts);
          resolve();
        });
      }
    });
  };

const renderResults: (q: string, r: Array<Record>)=>void =
  function (query: string, posts: Array<Record>) {
    const el: HTMLInputElement | any = document.getElementById('query');
    el.value = query;
    ExpertsComponent.render(posts);
  };

const SearchComponent = {
  resetForm,
  render,
};

export default SearchComponent;