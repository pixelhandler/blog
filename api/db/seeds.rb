# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

author = Author.new({ name: 'pixelhandler', email: 'pixelhandler@gmail.com'})

post = Post.new({ 
  slug: 'test-1',
  date: DateTime.now,
  title: 'Test 1',
  excerpt: 'Testing one post',
  body: 'This is only a test.'
})

post.author = author;

post.save!
