import Record from './record';

type Resources = {
  data: Array<Record>,
  included?: Array<Record>,
  meta: object,
  links: object,
  filter?: Function, // Array.filter
  forEach?: Function, // Array.forEach
  reduce?: Function, // Array.reduce
  length?: Number, // Array.length
  push?: Function, // Array.push
};

export default Resources;