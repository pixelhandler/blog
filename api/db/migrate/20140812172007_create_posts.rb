class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :slug
      t.string :title
      t.string :excerpt
      t.date :date
      t.text :body
      t.references :author, index: true
 
      t.timestamps
    end
  end
end
