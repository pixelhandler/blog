import Record from '../types/record';
import ExcerptComponent from './excerpt';

const render: (p: Array<Record>)=>void =
  function (posts: Array<Record>) {
    document.getElementById('content-main').innerHTML = '';
    posts.forEach(function(post: Record) {
      ExcerptComponent.render(post);
    });
  };

const ExpertsComponent = {
  render,
};

export default ExpertsComponent;