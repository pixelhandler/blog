import Post from '../types/post';
import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';

const render: (p: Post)=>void =
  function (attrs: Post): void {
    const parentNode = document.getElementById('content-recent-posts');
    const node: Element | any = cloneTemplate(constants.templates.recentPost);
    const link: HTMLAnchorElement | any = node.querySelector('.Blog-nav-list-item-link');
    link.innerText = attrs.title;
    link.href = '/posts/' + attrs.slug;
    requestAnimationFrame(function() { parentNode.appendChild(node); });
  };

const RecentPostComponent = {
  render,
};

export default RecentPostComponent;