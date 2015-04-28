class Post < ActiveRecord::Base
  belongs_to :author

  validates :slug, uniqueness: true

  def to_param
    slug
  end
end
