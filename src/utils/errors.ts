import Post from '../types/post';

export const notFoundError: (slug: string)=>string =
  function (slug: string): string {
    const attributes: Post = {
      slug: slug,
      title: 'Page Not Found',
      excerpt: 'The page /posts/' + slug + ' is gone missing.',
      body: 'Perhaps try using the search input to find what you are looking for :)'
    };
    return JSON.stringify({
      data: {
        attributes: attributes
      }
    });
  };

export const serverError: ()=>string =
  function (): string {
    const attributes: Post = {
      slug: 'server-error',
      title: 'Oops, There was System Error',
      excerpt: 'Please try again later :(',
      body: 'If this continues to fail tweet at me, @pixelhandler'
    };
    return JSON.stringify({
      data: [
        { attributes: attributes }
      ],
      included: []
    });
  };
