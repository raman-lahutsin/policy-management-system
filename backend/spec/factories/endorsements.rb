# frozen_string_literal: true

FactoryBot.define do
  factory :endorsement do
    policy
    endorsement_type { "policy_change" }
    effective_date { Date.current }
    premium { rand(-500..500) }
    description { Faker::Lorem.paragraph }

    trait :cancellation do
      endorsement_type { "cancellation" }
      premium { -rand(100..1000) }
    end

    trait :reinstatement do
      endorsement_type { "reinstatement" }
      premium { rand(100..1000) }
    end
  end
end
