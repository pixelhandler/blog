class Api::V1::PostsController < ApiControllerController
  skip_before_action :set_current_user, :authenticate_request, only: [:index, :show, :show_association, :get_related_resources]

  def show
    serializer = _serializer
    record = resource_klass.find_by_key(params[:id])
    render json: serializer.serialize_to_hash(record)
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
end
