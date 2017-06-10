import Post from './post';
import Tag from './tag';
import Author from './author';

type obj = {
  [index:string]: any,
}

type Record = {
  id?: string,
  type?: string,
  attributes: Post | Tag | Author | any,
  links?: obj,
  relationships?: obj
};

export default Record;