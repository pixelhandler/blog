// import * as showdown from '@types/showdown'
declare let showdown: any;
// import * as md5 from '@types/blueimp-md5';
declare function md5(value: string, key?: string, raw?: boolean): string;

const converter: any = new showdown.Converter();

const convertMarkdown: (t: string)=>string =
  function (text: string): string {
    const key: string = 'content|' + md5(text);
    let html: string = localStorage.getItem(key);
    if (html) {
      return html;
    } else {
      html = converter.makeHtml(text);
      localStorage.setItem(key, html);
      return html;
    }
  };

export default convertMarkdown;