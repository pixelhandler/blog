const _cache = {};

const cloneTemplate: (n: string)=>Element | any =
  function (name: string): Element | any {
    _cache[name] = _cache[name] || document.getElementById(name);
    return _cache[name].content.cloneNode(true);
  };

export default cloneTemplate;