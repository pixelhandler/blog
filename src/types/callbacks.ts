// import Resource from './resource';
// import Resources from './resources';
import Record from './record';

export type Ready = () => void;

export type SuccessCallback = (responseText: string) => void;

export type FailureCallback = (status: number, responseText: string) => void;

export type resolveRepoPromise = (value?: Array<Record> | Record) => void;

export type rejectRepoPromise = (reason?: Record | any) => void;