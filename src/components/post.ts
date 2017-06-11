import Record from '../types/record';
import Post from '../types/post';
import PostTagComponent from './post-tag';
import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';
import markdown from '../utils/markdown';
// import * as moment from 'moment';
declare let moment: any;

const render: (p: Record)=>void =
  function (post: Record): void {
    const parentNode: HTMLElement = document.getElementById('content-main');
    const node: Element | any = cloneTemplate(constants.templates.postDetail);
    const titleEl: HTMLElement = node.querySelector('.Blog-post-detail-title');
    titleEl.innerText = post.attributes.title;
    const authorEl: HTMLElement = node.querySelector('.Blog-post-detail-author');
    authorEl.innerText = post.relationships.author.data.attributes.name.split(' ')[0];
    const date = moment(post.attributes.date).fromNow();
    const dateEl: HTMLElement = node.querySelector('.Blog-post-detail-date');
    dateEl.innerText = '(' + date + ')';
    let html = markdown(post.attributes.excerpt);
    const excerptEl: HTMLElement = node.querySelector('.Blog-post-detail-excerpt');
    excerptEl.innerHTML = html;
    html = markdown(post.attributes.body);
    const postDetailEl: HTMLElement = node.querySelector('.Blog-post-detail-body');
    postDetailEl.innerHTML = html;
    parentNode.innerHTML = '';
    PostTagComponent.render(node, post);
    requestAnimationFrame(function() { parentNode.appendChild(node); });
  };

const PostComponent = {
  render,
};

export default PostComponent;