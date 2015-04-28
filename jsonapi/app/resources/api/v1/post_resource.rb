require 'jsonapi/resource'

class Api::V1::PostResource < JSONAPI::Resource
  attributes :id, :title, :slug, :excerpt, :date, :body
  has_one :author

  paginator :offset

  class << self
    # Find by slug or id
    def find_by_key(slug, options = {})
      context = options[:context]
      model = records(options).where(slug: slug).first
      if model.nil?
        model = records(options).where({_primary_key => slug}).first
      end
      if model.nil?
        raise JSONAPI::Exceptions::RecordNotFound.new(slug)
      end
      self.new(model, context)
    end

    def count(options = {})
      records(options).count
    end
  end
end
