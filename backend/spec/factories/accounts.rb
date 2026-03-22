# frozen_string_literal: true

FactoryBot.define do
  factory :account do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.unique.email }
    phone { Faker::PhoneNumber.phone_number }
    date_of_birth { Faker::Date.birthday(min_age: 18, max_age: 80) }
    address_line1 { Faker::Address.street_address }
    city { Faker::Address.city }
    state { Faker::Address.state_abbr }
    zip_code { Faker::Address.zip_code }
  end
end
