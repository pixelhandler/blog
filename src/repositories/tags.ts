import ajax from '../utils/ajax';
import cache from '../application/cache';
import constants from '../utils/constants';

import Resources from '../types/resources';
import Resource from '../types/resource';
import Record from '../types/record';
import Tag from '../types/tag';
import { resolveRepoPromise, rejectRepoPromise } from '../types/callbacks';

import postsRepo from './posts';

declare var Promise: any;

const getTags: ()=>Promise<Record[]> =
  function (): Promise<Record[]> {
    const promiseHandler: (resolve: resolveRepoPromise, reject: rejectRepoPromise)=>void =
      function (resolve?: resolveRepoPromise, reject?: rejectRepoPromise): void {
        if (cache.tags && cache.tags.length) {
          resolve(cache.tags);
        } else {
          postsRepo.getPosts().then(function() {
            resolve(cache.tags);
          });
        }
      };
    return new Promise(promiseHandler);
  };

const getTag: (n: string)=>Promise<Record> =
  function (name: string): Promise<Record> {
    const promiseHandler: (resolve: resolveRepoPromise, reject: rejectRepoPromise)=>void =
      function (resolve?: resolveRepoPromise, reject?: rejectRepoPromise): void {
        var key = 'tag|' + name;
        if (cache.cache[key]) {
          resolve(cache.cache[key]);
        } else {
          getTags().then(function(tags) {
            cache.cache[key] = tags.filter(function(record: Record) {
              return record.attributes.slug === name;
            })[0];
            resolve(cache.cache[key]);
          });
        }
      };
    return new Promise(promiseHandler);
  };

const getPostTags: (post: Record)=>Array<Record> =
  function (post: Record): Array<Record> {
    const relations = (post.relationships) ? post.relationships : {};
    const data = relations.tags ? relations.tags.data || [] : [];
    const tagIds = data.map(function(rel: Record) {
      return rel.id;
    });
    // Relying on resolution of getPosts() which has a side effect, sets cache.tags
    const postTags: Array<Record> = cache.tags.filter(function(tag: Record) {
      return tagIds.indexOf(tag.id) !== -1;
    });
    return postTags;
  };

const tagsRepo = {
  getTags,
  getTag,
  getPostTags,
};

export default tagsRepo;