class AuthorSerializer < ApplicationSerializer
  attributes :id, :name, :email, :links

  def links
    { posts: object.post_ids }
  end
end
