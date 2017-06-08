import constants from '../utils/constants';
import cloneTemplate from '../utils/clone-template';

const renderPage: (t: string)=>Function =
  function (templateName: string): Function {
    return function render(): void {
      const parentNode: Element = document.getElementById('content-main');
      const node: Element | any = cloneTemplate(constants.templates[templateName]);
      parentNode.innerHTML = '';
      requestAnimationFrame(function() { parentNode.appendChild(node); });
    };
  };

export default renderPage;
