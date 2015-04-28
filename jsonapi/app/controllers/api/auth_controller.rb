class Api::AuthController < ApplicationController

  skip_before_action :authenticate_request

  def authenticate
    user = User.find_by_credentials(params[:username], params[:password])
    if user
      render json: { auth_token: user.generate_auth_token }
    else
      render json: { error: 'Invalid username or password' }, status: :unauthorized
    end
  end

  private
    def auth_params
      params.require(:auth).permit(:username, :password)
    end
end
