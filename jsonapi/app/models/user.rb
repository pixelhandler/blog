class User < ActiveRecord::Base
  belongs_to :author

  has_secure_password

  validates :username, :length => { :minimum => 8 }
  validates :password, :length => { :minimum => 8 }

  validates_confirmation_of :password

  def generate_auth_token
    payload = { user_id: self.id }
    AuthToken.encode(payload)
  end

  def self.find_by_credentials(username, password)
    user = self.where(username: username).first
    user = user.authenticate(password) if user
    user
  end
end
