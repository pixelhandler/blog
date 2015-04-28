class Api::V1::PostsController < ApiControllerController
  skip_before_action :set_current_user, :authenticate_request, only: [:index, :show, :show_association, :get_related_resources]

  def index
    sort_criteria = @request.sort_criteria
    sort_criteria = _default_sort if sort_criteria.empty?
    records = resource_klass.find(resource_klass.verify_filters(@request.filters, context),
                                  context: context,
                                  sort_criteria: sort_criteria,
                                  paginator: @request.paginator)
    payload = _serializer.serialize_to_hash(records)
    _add_meta_to(payload)
    render json: payload
  rescue => e
    handle_exceptions(e)
  end

  def show
    record = resource_klass.find_by_key(params[:id])
    payload = _serializer.serialize_to_hash(record)
    render json: payload
  rescue => e
    handle_exceptions(e)
  end

  private
    def post_params
      params.require(:post).permit(:body, :excerpt, :slug, :title, :date)
    end

    def _serializer
      JSONAPI::ResourceSerializer.new(resource_klass,
                                      include: @request.include,
                                      fields: @request.fields,
                                      base_url: base_url,
                                      key_formatter: key_formatter,
                                      route_formatter: route_formatter)
    end

    def _default_sort
      [{:field=>"date", :direction=>:desc}, {:field=>"id", :direction=>:desc}]
    end

    def _add_meta_to(payload)
      no_page_params = !params.has_key?(:page)
      payload[:meta] = {
        page: {
          sort: !params.has_key?(:sort) ? '-date,-id' : params[:sort],
          total: resource_klass.count,
          limit: no_page_params ? JSONAPI.configuration.default_page_size : params[:page][:limit],
          offset: no_page_params ? 0 : params[:page][:offset]
        }
      }
    end
end
