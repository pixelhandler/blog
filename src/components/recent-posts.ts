// import Resources from '../types/resources';
import Record from '../types/record';
import Post from '../types/post';
import RecentPostComponent from './recent-post';

const render: (r: Array<Record> )=>void =
  function (resources: Array<Record>): void {
    const recent: Array<Record> = resources.reduce(function(posts: Array<Record>, post: Record) {
      if (posts.length <= 10) {
        posts.push(post);
      }
      return posts;
    }, []);
    document.getElementById('content-recent-posts').innerHTML = '';
    recent.forEach(function(post: Record) {
      const attrs: Post = post.attributes;
      RecentPostComponent.render(attrs);
    });
  };

const RecentPostsComponent = {
  render,
};

export default RecentPostsComponent;