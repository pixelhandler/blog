class PostSerializer < ApplicationSerializer
  attributes :id, :slug, :title, :date, :excerpt, :body, :links

  def links
    { author: object.author_id }
  end
end
