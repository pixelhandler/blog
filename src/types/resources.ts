import Record from './record';

type obj = {
  [index:string]: any,
}

type Resources = {
  data: Array<Record>,
  included?: Array<Record>,
  meta: obj,
  links: obj,
  filter?: Function, // Array.filter
  forEach?: Function, // Array.forEach
  reduce?: Function, // Array.reduce
  length?: Number, // Array.length
  push?: Function, // Array.push
};

export default Resources;