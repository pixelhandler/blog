import Cache from '../interfaces/cache';

const cache: Cache = {
  data: null,
  templates: {},
  tags: null,
  posts: null,
  postsJson: null,
  excerpts: null,
  authors: null,
  archives: null,
  archivesJson: null,
  detailJson: {},
  details: {},
  currentState: null,
  cache: {},
};

export default cache;