import IRoutes from '../interfaces/routes';

const routes: IRoutes = {
  search: /^\?search=/,
  about: /^\/about$/,
  archive: /^\/posts$/,
  tags: /^\/tags$/,
  tag: /^\/tag\/[\w\-]+$/,
  post: /^\/posts\/[\w\-]+$/,
};

export default routes;