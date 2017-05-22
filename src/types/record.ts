import Post from './post';
import Tag from './tag';

type obj = {
  [index:string]: any,
}

type Record = {
  id?: string,
  type?: string,
  attributes: Post | Tag | any,
  links?: obj,
  relationships?: obj
};

export default Record;