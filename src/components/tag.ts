import Record from '../types/Record';
import Tag from '../types/tag';
import tagsRepo from '../repositories/tags';
import ExcerptComponent from './excerpt';
import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';

const render: (t: Record, p: Array<Record>)=>void =
  function (tag: Record, posts: Array<Record>): void {
    const parentNode: HTMLElement = document.getElementById('content-main');
    parentNode.innerHTML = '';
    const node: Element | any = cloneTemplate(constants.templates.tagPosts);
    const tagsEl: HTMLElement = node.querySelector('.Blog-tag-name');
    const attrs: Tag = tag.attributes;
    tagsEl.innerHTML = attrs.name;
    parentNode.appendChild(node);
    posts.forEach(function(post: Record): void {
      ExcerptComponent.render(post);
    });
  };

const TagComponent = {
  render,
};

export default TagComponent;