import Record from '../types/record';
import Tag from '../types/tag';
import constants from '../utils/constants';
import tagsRepo from '../repositories/tags';
import cloneTemplate from '../utils/clone-template';

const render: (r: Array<Record>)=>void =
  function (tags: Array<Record>): void {
    const parentNode: HTMLElement = document.getElementById('content-main');
    parentNode.innerHTML = '';
    const node: Element | any = cloneTemplate(constants.templates.tags);
    parentNode.appendChild(node);
    tags.forEach(renderTagItem);
  };

const renderTagItem: (t: Record)=>void =
  function (tag: Record): void {
    const node: Element | any = cloneTemplate(constants.templates.tagItem);
    const anchorEl: HTMLAnchorElement = node.querySelector('.Blog-tags-item-link');
    anchorEl.innerText = tag.attributes.name;
    anchorEl.href = '/tag/' + tag.attributes.slug;
    const parentNode: HTMLElement = document.getElementById('content-tag-items');
    requestAnimationFrame(function() { parentNode.appendChild(node); });
  };

const TagsComponent = {
  render,
  renderTagItem,
};

export default TagsComponent;