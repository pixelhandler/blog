import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';

const render: ()=>void =
  function (): void {
    const parentNode: Element = document.getElementById('content-main');
    const node: Element | any = cloneTemplate(constants.templates.about);
    parentNode.innerHTML = '';
    requestAnimationFrame(function() { parentNode.appendChild(node); });
  };

const AboutComponent = {
  render,
};

export default AboutComponent;