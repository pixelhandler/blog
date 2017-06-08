import IRoutes from '../interfaces/routes';

const routes: IRoutes = {
  search: /^\?search=/,
  about: /^\/about$/,
  archive: /^\/posts$/,
  tags: /^\/tags$/,
  tag: /^\/tag\/[\w\-]+$/,
  post: /^\/posts\/[\w\-]+$/,
  renew: /^\/renew$/,
  sleep: /^\/sleep$/,
  energy: /^\/energy$/,
  neuro: /^\/neuro$/,
  coreEssentials: /^\/core-essentials$/,
  science: /^\/science$/,
  vasayo: /^\/vasayo$/,
};

export default routes;