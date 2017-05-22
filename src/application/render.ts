import State from '../types/state';
import routes from './routes';
import { setupEventListeners, teardownEventListeners } from './listeners';

import Post from '../types/post';
import Tag from '../types/tag';
import Resources from '../types/resources';
import Resource from '../types/resource';
import Record from '../types/record';

import AboutComponent from '../components/about';
import ArchivesComponent from '../components/archives';
import ExcerptsComponent from '../components/excerpts';
import PostComponent from '../components/post';
import SearchComponent from '../components/search';
import TagComponent from '../components/tag';
import TagsComponent from '../components/tags';

import postsRepo from '../repositories/posts';
import tagsRepo from '../repositories/tags';

declare var Promise: any;

export function render(state: State, title: string, url: string): Promise<any> {
  const promise: Promise<any> = new Promise(function(resolve: any) {
    teardownEventListeners();
    window.scroll(0, 0);
    if (!location.search) {
      SearchComponent.resetForm();
    }
    if (location.search && location.search.match(routes.search)) {
      SearchComponent.render(location.search.slice(1).split('search=')[1])
      .then(resolve);
    } else if (location.pathname === '/') {
      postsRepo.getPosts().then(function(posts: Array<Record>) {
        ExcerptsComponent.render(posts);
        resolve();
      });
    } else if (location.pathname.match(routes.about)) {
      AboutComponent.render();
      resolve();
    } else if (location.pathname.match(routes.archive)) {
      postsRepo.getArchives().then(ArchivesComponent.render);
      resolve();
    } else if (location.pathname.match(routes.tags)) {
      tagsRepo.getTags().then(function(tags: Array<Record>) {
        TagsComponent.render(tags);
        resolve();
      });
    } else if (location.pathname.match(routes.tag)) {
      tagsRepo.getTag(location.pathname.split('/')[2]).then(function (tag: Record) {
        postsRepo.getPostsByTag(tag).then(function(posts: Array<Record>) {
          TagComponent.render(tag, posts);
          resolve();
        });
      });
    } else if (location.pathname.match(routes.post)) {
      var slug = location.pathname.split('/')[2];
      postsRepo.getPostBySlug(slug).then(function() {
        postsRepo.loadPost(slug, function(post: Record) {
          PostComponent.render(post);
          resolve();
        });
      });
    }
  }).then(function() {
    setTimeout(function() {
      setupEventListeners();
    }, 100);
  });
  return promise;
}