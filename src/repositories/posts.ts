import ajax from '../utils/ajax';
import cache from '../application/cache';
import constants from '../utils/constants';
import Resources from '../types/resources';
import Resource from '../types/resource';
import Record from '../types/record';
import Post from '../types/post';
import { notFoundError, serverError } from '../utils/errors';
import { resolveRepoPromise, rejectRepoPromise } from '../types/callbacks';

declare var Promise: any;

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
      params: '?sort=-date&page[limit]=100&fields[posts]=title,slug'
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
      cache.posts = resources.data;
      cache.tags = resources.included.filter(function(record: Record) {
        return record.type === constants.TAGS;
      });
      callback(cache.posts);
    }
    return ajax({
      method: 'GET',
      endpoint: constants.api.posts,
      params: '?sort=-date&page[limit]=20&fields[post]=title,date,slug,excerpt&include=tags'
    }, function searchSuccess(responseText: string) {
      localStorage.setItem('postsJson', responseText);
      const resources: Resources = JSON.parse(responseText);
      cache.posts = resources.data;
      cache.tags = resources.included.filter(function(record: Record) {
        return record.type === constants.TAGS;
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
      cache.details[slug] = record;
      return callback(record);
    }
    return ajax({
      method: 'GET',
      endpoint: constants.api.posts + '/' + slug,
    }, function postDetailsSuccess(responseText: string) {
      localStorage.setItem('detailJson:' + slug, responseText);
      const record: Record = JSON.parse(responseText).data;
      cache.details[slug] = record;
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
        var key = 'slug|' + slug;
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