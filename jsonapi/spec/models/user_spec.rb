require 'rails_helper'

RSpec.describe User, type: :model do

  it 'fails because no password' do
    expect(
      User.new({
        :username => 'hans'}
      ).save
    ).to be_falsy
  end

  it 'fails because password to short' do
    expect(
      User.new({
        :username => 'hans',
        :password => 'han'
      }).save
    ).to be_falsy
  end

  it 'succeeds because password is long enough' do
    expect(
      User.new({
        :username => 'hans',
        :password => 'hansohanso'
      }).save
    ).to be_truthy
  end

  it 'fails because password confirmation does not match' do
    expect(
      User.new({
        :username => 'hans',
        :password => 'hansohanso',
        :password_confirmation => 'aa'
      }).save
    ).to be_falsy
  end

  it 'succeeds because password & confirmation match' do
    expect(
      User.new({
        :username => 'hans',
        :password => 'hansohanso',
        :password_confirmation => 'hansohanso'
      }).save
    ).to be_truthy
  end

  it 'successfully authenticates a user with a valid password' do
    User.new({
      :username => 'hans',
      :password => 'hansohanso',
      :password_confirmation => 'hansohanso'
    }).save
    user = User.where({username: 'hans'}).first;
    authenticated = user.authenticate('hansohanso')

    expect(authenticated).to be_a_kind_of(User)
  end

  it 'does not authenticates a user with an invalid password' do
    User.new({
      :username => 'hans',
      :password => 'hansohanso',
      :password_confirmation => 'hansohanso'
    }).save
    user = User.where({username: 'hans'}).first;
    authenticated = user.authenticate('hansohanso777')

    expect(authenticated).to_not be_a_kind_of(User)
    expect(authenticated).to be_falsy
  end

end
