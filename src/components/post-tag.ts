import Record from '../types/record';
import Tag from '../types/tag';
import constants from '../utils/constants';
import tagsRepo from '../repositories/tags';
import cloneTemplate from '../utils/clone-template';

const render: (e: Element, r: Record)=>void =
  function (node: Element, post: Record) {
    const parentNode: Element = node.querySelector('.content-post-tags');
    tagsRepo.getPostTags(post).forEach(function(tag: Record) {
      const node: Element | any = cloneTemplate(constants.templates.postTag);
      const link: HTMLAnchorElement | any = node.querySelector('.Blog-tags-item-link');
      const attrs: Tag = tag.attributes;
      link.innerText = attrs.name;
      link.href = '/tag/' + attrs.slug;
      requestAnimationFrame(function() { parentNode.appendChild(node); });
    });
  };

const PostTagComponent = {
  render,
};

export default PostTagComponent;