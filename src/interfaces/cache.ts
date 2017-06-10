import Record from '../types/record';
import State from '../types/state';

type cacheRecord = {
  [index:string]: Record | any,
}

interface Cache {
  data: object | null,
  templates: object,
  tags: Array<Record> | null,
  posts: Array<Record> | null,
  postsJson: string | null,
  excerpts: Array<Record> | null,
  authors: Array<Record> | null,
  archives: Array<Record> | null,
  archivesJson: string | null,
  detailJson: cacheRecord,
  details: cacheRecord,
  currentState: State,
  cache: cacheRecord,
}

export default Cache;