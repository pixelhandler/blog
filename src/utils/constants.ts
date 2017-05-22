import Constants from '../interfaces/constants';

const constants: Constants = {
  templates: {
    excerpt: 'excerpt',
    recentPost: 'recent-post',
    excerptTag: 'excerpt-tag',
    postDetail: 'post-detail',
    about: 'about',
    archive: 'archive',
    archiveLink: 'archive-link',
    tags: 'tags',
    tagItem: 'tag-item',
    tagPosts: 'tag-posts',
    postTag: 'excerpt-tag',
  },
  api: {
    url: ['https://pixelhandler.com/api', 'http://localhost:8080/api'][0],
    posts: '/v1/posts',
  },
  TAGS: 'tags',
};

export default constants;