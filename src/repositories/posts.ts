import ajax from '../utils/ajax';
import cache from '../application/cache';
import constants from '../utils/constants';
import Resources from '../types/resources';
import Resource from '../types/resource';
import Record from '../types/record';
import Post from '../types/post';
import { notFoundError, serverError } from '../utils/errors';
import { resolveRepoPromise, rejectRepoPromise } from '../types/callbacks';

declare let Promise: any;

const getArchives: ()=>Promise<Record[]> =
  function (): Promise<Record[]> {
    const promiseHandler: (resolve: resolveRepoPromise, reject: rejectRepoPromise)=>void =
      function (resolve?: resolveRepoPromise, reject?: rejectRepoPromise): void {
        if (cache.archives && cache.archives.length) {
          resolve(cache.archives);
        } else {
          loadArchives(resolve, reject);
        }
      };

    return new Promise(promiseHandler);
  };

const loadArchives: (success: Function, fail?: Function)=>void =
  function (callback: Function, failure?: Function): void {
    cache.archivesJson = localStorage.getItem('archives');
    if (cache.archivesJson) {
      return callback(JSON.parse(cache.archivesJson).data);
    }
    return ajax({
      method: 'GET',
      endpoint: constants.api.posts,
      params: '?sort=-date&page[limit]=100&fields[posts]=title,slug,date'
    }, function archivesSuccess(responseText: string) {
      localStorage.setItem('archivesJson', responseText);
      cache.archives = JSON.parse(responseText).data;
      callback(cache.archives);
    });
  };

const getPosts: ()=>Promise<Record[]> =
  function (): Promise<Record[]> {
    const promiseHandler: (resolve: resolveRepoPromise, reject: rejectRepoPromise)=>void =
      function (resolve?: resolveRepoPromise, reject?: rejectRepoPromise): void {
        if (cache.posts && cache.posts.length) {
          resolve(cache.posts);
        } else {
          loadPosts(resolve, reject);
        }
      };
    return new Promise(promiseHandler);
  };

const loadPosts: (callback: Function, failure: Function)=>void =
  function (callback: Function, failure?: Function): void {
    cache.postsJson = localStorage.getItem('posts');
    if (cache.postsJson) {
      const resources: Resources = JSON.parse(cache.postsJson);
      if (!resources.meta || resources.meta.expires && resources.meta.expires < Date.now()) {
        localStorage.removeItem('posts');
        return loadPosts(callback, failure);
      }
      cache.posts = resources.data;
      cache.tags = resources.included.filter((record: Record) => {
        return record.type === constants.TAGS;
      });
      callback(cache.posts);
    }
    return ajax({
      method: 'GET',
      endpoint: constants.api.posts,
      params: '?sort=-date&page[limit]=20&fields[posts]=title,date,slug,excerpt,author,tags&include=tags,author'
    }, function loadSuccess(responseText: string) {
      const resources: Resources = JSON.parse(responseText);
      resources.meta.expires = Date.now() + constants.CACHE_OFFSET;
      localStorage.setItem('postsJson', JSON.stringify(resources));
      cache.posts = resources.data;
      cache.tags = resources.included.filter((record: Record) =>{
        return record.type === constants.TAGS;
      });
      cache.authors = resources.included.filter((record: Record) =>{
        return record.type === constants.AUTHORS;
      });
      cache.posts.forEach(p => {
        p.relationships.author.data = cache.authors.filter((a: Record) => {
          return a.type === constants.AUTHORS && a.id === p.relationships.author.data.id;
        })[0];
      });
      callback(cache.posts);
    });
  };

const loadPost: (s: string, success: Function, failure?: Function)=>void =
  function (slug: string, callback: Function, failure?: Function): void {
    const storedJSON: string = localStorage.getItem('detailJson:' + slug);
    if (storedJSON) {
      cache.detailJson[slug] = storedJSON;
      const record: Record = JSON.parse(storedJSON).data;
      if (!record.meta || record.meta.expires < Date.now()) {
        localStorage.removeItem('detailJson:' + slug);
        return loadPost(slug, callback, failure);
      }
      cache.details[slug] = record;
      record.relationships.author.data = cache.authors.filter((a: Record) => {
        return record.relationships.author.data.id == a.id;
      })[0];
      return callback(record);
    }
    return ajax({
      method: 'GET',
      endpoint: `${constants.api.posts}/${slug}?include=tags,author`,
    }, function postDetailsSuccess(responseText: string) {
      const resp: any = JSON.parse(responseText);
      const record: Record = resp.data;
      record.meta = record.meta || {};
      record.meta.expires = Date.now() + constants.CACHE_OFFSET;
      localStorage.setItem('detailJson:' + slug, JSON.stringify(resp));
      cache.details[slug] = record;
      record.relationships.author.data = resp.included.filter((r: Record) =>{
        return r.type === constants.AUTHORS && r.id === record.relationships.author.data.id;
      })[0];
      callback(record);
    }, function postDetailsFailure(status, responseText) {
      if (status === 404) {
        callback(JSON.parse(notFoundError(slug)).data);
      } else if (status >= 500) {
        callback(JSON.parse(serverError()).data[0]);
      }
    });
  };


const getPostsByTag: (t: Record)=>Promise<Array<Record>> =
  function (tag: Record): Promise<Array<Record>> {
    return new Promise(function _getPostsByTag(resolve:any, reject: any) {
      getPosts().then(function(posts) {
        const postsByTag: Array<Record> = posts.filter(function(post: Record) {
          const relations: any = (post.relationships) ? post.relationships : {};
          const data: Array<object> = relations.tags ? relations.tags.data || [] : [];
          return data.filter(function(rel: Record) {
            return rel.id === tag.id;
          })[0];
        });
        resolve(postsByTag);
      }, reject);
    });
  };

const getPostBySlug: (s: string)=>Promise<Record> =
  function (slug: string): Promise<Record> {
    return new Promise(function(resolve: any, reject: any) {
      getPosts().then(function(posts: Array<Record>) {
        const key = 'slug|' + slug;
        cache.cache[key] = cache.cache[key] || posts.filter(function(post: Record) {
          return post.attributes.slug === slug;
        })[0];
        resolve(cache.cache[key]);
      });
    });
  };

const searchPosts: (q: string, cb: (any)=>any)=>void =
  function (query: string, callback: Function): void {
    return ajax({
      method: 'GET',
      endpoint: constants.api.posts,
      params: '?fields[posts]=title,excerpt,slug&page[limit]=20&filter[search]=' + query
    }, function searchSuccess(responseText: string):void {
      const resources: Resources = JSON.parse(responseText);
      let data: Array<Record> = resources.data;
      if (!data.length) {
        const msg: Post = {
          title: 'Please try another search…',
          excerpt: 'There were no results for: *' + encodeURI(query) + '*'
        };
        const record: Record = {
          attributes: msg
        };
        data = [record];
      }
      callback(data);
    });
  };

const postsRepo = {
  getArchives,
  getPosts,
  getPostsByTag,
  getPostBySlug,
  loadPosts,
  loadPost,
  searchPosts,
};

export default postsRepo;
