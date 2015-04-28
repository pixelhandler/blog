# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150426195721) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authors", force: :cascade do |t|
    t.string   "email"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: :cascade do |t|
    t.string   "body"
    t.string   "excerpt"
    t.string   "slug"
    t.string   "title"
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "author_id"
  end

  add_index "posts", ["author_id"], name: "index_posts_on_author_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.integer  "author_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
    t.string   "username"
  end

  add_index "users", ["author_id"], name: "index_users_on_author_id", using: :btree

  add_foreign_key "posts", "authors"
  add_foreign_key "users", "authors"
end
