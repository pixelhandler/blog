import Record from '../types/record';
import Post from '../types/post';
import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';
// import * as moment from 'moment';
declare let moment: any;

const render: (p: Array<Record>)=>void =
  function (posts: Array<Record>): void {
    const parentNode = document.getElementById('content-main');
    parentNode.innerHTML = '';
    const node: Element | any = cloneTemplate(constants.templates.archive);
    parentNode.appendChild(node);
    posts.forEach(renderArchiveLink);
  };

function renderArchiveLink(post: Record): void {
  const attrs: Post = post.attributes;
  const node: Element | any = cloneTemplate(constants.templates.archiveLink);
  const date = moment(attrs.date).format('YYYY/MM/DD');
  node.querySelector('.Blog-list-date').innerText = date;
  const anchor = node.querySelector('.Blog-list-link-anchor');
  anchor.innerText = attrs.title;
  anchor.href = '/posts/' + attrs.slug;
  const parentNode = document.querySelector('#content-archive-links');
  requestAnimationFrame(function() { parentNode.appendChild(node); });
}

const ArchivesComponent = {
  render,
};

export default ArchivesComponent;