class AddAuthorRefToPosts < ActiveRecord::Migration
  def change
    add_reference :posts, :author, index: true, foreign_key: true
  end
end
