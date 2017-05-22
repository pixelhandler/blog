import Post from '../types/post';
import State from '../types/state';
import postRepo from '../repositories/posts';
import RecentPostsComponent from '../components/recent-posts';
import transitionTo from './transition';
import Record from '../types/record';
import Resources from '../types/resources';

export default function start(): Promise<any> {
  return postRepo.getArchives().then(function(posts: Record[]) {
    RecentPostsComponent.render(posts);
    postRepo.getPosts().then(function(excerpts: Record[]) {
      excerpts.forEach(function(excerpt: Record) {
        const post: Record = posts.filter(function(p: Record) {
          return p.id === excerpt.id;
        })[0];
        if (post) {
          post.attributes.excerpt = excerpt.attributes.excerpt;
        }
      });
      const url = location.toString();
      const state: State = { page: url, title: url, url: url };
      transitionTo(state, false, true);
    });
  });
}