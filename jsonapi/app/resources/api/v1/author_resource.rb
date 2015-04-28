require 'jsonapi/resource'

class Api::V1::AuthorResource < JSONAPI::Resource
  attributes :id, :name, :email
  has_many :posts
end
