class CreateAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|
      t.string :name
      t.string :email
      t.references :post, index: true

      t.timestamps
    end
  end
end
