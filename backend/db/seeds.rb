# frozen_string_literal: true

# Create default admin user
User.find_or_create_by!(email: "admin@example.com") do |u|
  u.first_name = "Admin"
  u.last_name = "User"
  u.password = "password123"
  u.password_confirmation = "password123"
  u.role = "admin"
end

puts "Seeded #{User.count} users"

# Skip test data generation if accounts already exist
if Account.count > 0
  puts "Test data already exists, skipping seed generation."
  return
end

puts "Generating test data..."

INSURANCE_TYPES = %w[general_liability professional_liability commercial_property business_owners].freeze
POLICY_STATUSES = %w[draft active expired cancelled].freeze
ENDORSEMENT_TYPES = %w[policy_change cancellation reinstatement].freeze
US_STATES = %w[AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY].freeze

ActiveRecord::Base.transaction do
  accounts = 50.times.map do
    Account.create!(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      email: Faker::Internet.unique.email,
      phone: Faker::PhoneNumber.phone_number,
      date_of_birth: Faker::Date.birthday(min_age: 18, max_age: 80),
      address_line1: Faker::Address.street_address,
      address_line2: [nil, Faker::Address.secondary_address].sample,
      city: Faker::Address.city,
      state: US_STATES.sample,
      zip_code: Faker::Address.zip_code
    )
  end

  puts "Created #{accounts.size} accounts"

  no_policy_accounts = accounts[0, 10]
  single_policy_accounts = accounts[10, 15]
  multi_policy_accounts = accounts[25, 25]

  generate_dates = lambda do |status|
    case status
    when "active"
      effective = Faker::Date.between(from: 1.year.ago, to: Date.current)
      expiration = Faker::Date.between(from: Date.current + 1.day, to: 2.years.from_now)
    when "expired"
      effective = Faker::Date.between(from: 3.years.ago, to: 2.years.ago)
      expiration = Faker::Date.between(from: 1.year.ago, to: Date.current - 1.day)
    when "draft"
      effective = Faker::Date.between(from: Date.current, to: 6.months.from_now)
      expiration = effective + rand(180..730).days
    when "cancelled"
      effective = Faker::Date.between(from: 2.years.ago, to: 6.months.ago)
      expiration = effective + rand(180..730).days
    end
    [effective, expiration]
  end

  weighted_statuses = (%w[active] * 5 + %w[draft] * 2 + %w[expired] * 2 + %w[cancelled] * 1).freeze

  create_policy = lambda do |account|
    status = weighted_statuses.sample
    effective_date, expiration_date = generate_dates.call(status)

    Policy.create!(
      account: account,
      insurance_type: INSURANCE_TYPES.sample,
      status: status,
      premium: rand(500..50_000),
      coverage: rand(50_000..2_000_000),
      effective_date: effective_date,
      expiration_date: expiration_date,
      description: [nil, Faker::Lorem.sentence(word_count: 10)].sample
    )
  end

  # --- Policies ---
  policies = []

  single_policy_accounts.each do |account|
    policies << create_policy.call(account)
  end

  multi_policy_accounts.each do |account|
    rand(2..4).times { policies << create_policy.call(account) }
  end

  puts "Created #{policies.size} policies"

  shuffled_policies = policies.shuffle
  no_endorsement_count = (policies.size * 0.2).round
  single_endorsement_count = (policies.size * 0.3).round

  no_endorsement_policies = shuffled_policies[0, no_endorsement_count]
  single_endorsement_policies = shuffled_policies[no_endorsement_count, single_endorsement_count]
  multi_endorsement_policies = shuffled_policies[(no_endorsement_count + single_endorsement_count)..]

  endorsement_count = 0

  create_endorsement = lambda do |policy|
    etype = ENDORSEMENT_TYPES.sample
    eff_date = Faker::Date.between(from: policy.effective_date, to: policy.expiration_date)

    premium = case etype
              when "cancellation" then -rand(100..5000)
              when "reinstatement" then rand(100..5000)
              else rand(-2000..3000)
              end

    Endorsement.create!(
      policy: policy,
      endorsement_type: etype,
      effective_date: eff_date,
      premium: premium,
      description: [nil, Faker::Lorem.sentence(word_count: 8)].sample
    )
    endorsement_count += 1
  end

  single_endorsement_policies.each do |policy|
    create_endorsement.call(policy)
  end

  multi_endorsement_policies.each do |policy|
    rand(2..4).times { create_endorsement.call(policy) }
  end

  puts "Created #{endorsement_count} endorsements"
end

puts "\nSeed summary:"
puts "  Accounts:     #{Account.count}"
puts "  Policies:     #{Policy.count}"
puts "  Endorsements: #{Endorsement.count}"
puts "  Accounts without policies: #{Account.left_joins(:policies).where(policies: { id: nil }).count}"
puts "  Policies without endorsements: #{Policy.left_joins(:endorsements).where(endorsements: { id: nil }).count}"
