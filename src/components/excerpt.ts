import Record from '../types/record';
import Post from '../types/post';
import Tag from '../types/tag';
import PostTagComponent from './post-tag';
import constants from '../utils/constants';
import tagsRepo from '../repositories/tags';
import cloneTemplate from '../utils/clone-template';
import markdown from '../utils/markdown';

const render: (p: Record)=>void =
  function (post: Record) {
    const parentNode: Element = document.getElementById('content-main');
    const node: Element | any = cloneTemplate(constants.templates.excerpt);
    const link: HTMLAnchorElement | any = node.querySelector('.Blog-excerpt-title-link');
    const attrs: Post = post.attributes;
    const href = '/posts/' + attrs.slug;
    link.innerText = attrs.title;
    link.href = href;
    node.querySelector('.Blog-excerpt-title-more').href = href;
    const html: string = markdown(attrs.excerpt);
    node.querySelector('.Blog-excerpt-summary').innerHTML = html;
    PostTagComponent.render(node, post);
    requestAnimationFrame(function() { parentNode.appendChild(node); });
  };

const ExpertComponent = {
  render,
};

export default ExpertComponent;