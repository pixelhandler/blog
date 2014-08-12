class AuthorsController < ApplicationController
  respond_to :json, :json_patch

  def index
    render json: documents, root: 'authors', each_serializer: AuthorSerializer
  end

  def show
    render json: document, root: 'authors', serializer: AuthorSerializer
  end

  def update
    respond_to do |format|
      format.json do
        debugger
        # perform a partial update
        document.update params[:author]
        render 204
      end

      format.json_patch do
        debugger
        # perform sophisticated change
      end
    end
  end

  protected

  def document
    @document ||= (params[:action].to_s == 'create') ? Author.new(params[:author]) : Author.find(params[:id])
  end

  def documents
    if params[:ids].present?
      params[:id] = params[:ids]
      params.delete :ids
    end
    @documents ||= Author.all
  end

  private

  def author_params
    params.require(:post).permit(:name, :email, :post_ids)
  end
end
