class PostsController < ApplicationController
  respond_to :json_patch, :json

  def index
    render json: documents, root: :posts, each_serializer: PostSerializer
  end

  def show
    render json: document, root: :posts, serializer: PostSerializer
  end

  def update
    respond_to do |format|
      format.json do
        if request.content_type == "application/json-patch+json"
          debugger
          puts params
        end
        # perform a partial update
        @author.update params[:author]
      end

      format.json_patch do
        debugger
        # perform sophisticated change
      end
    end
  end

  protected

  def document
    @document ||= (params[:action].to_s == 'create') ? Post.new(params[:post]) : Post.find(params[:id])
  end

  def documents
    if params[:ids].present?
      params[:id] = params[:ids]
      params.delete :ids
    end
    @documents ||= Post.all
  end

  private

  def post_params
    params.require(:post).permit(:op, :path, :value, :slug, :title, :date, :excerpt, :body, :author_id)
  end
end
