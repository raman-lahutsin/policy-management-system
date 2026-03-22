# frozen_string_literal: true

FactoryBot.define do
  factory :policy do
    account
    insurance_type { "general_liability" }
    status { "active" }
    premium { rand(100..5000) }
    coverage { rand(10_000..500_000) }
    effective_date { Date.current }
    expiration_date { 1.year.from_now.to_date }

    trait :draft do
      status { "draft" }
    end

    trait :expired do
      status { "expired" }
      effective_date { 2.years.ago.to_date }
      expiration_date { 1.year.ago.to_date }
    end

    trait :cancelled do
      status { "cancelled" }
    end
  end
end
