# frozen_string_literal: true

require "rails_helper"

RSpec.describe Policy do
  describe "associations" do
    it { is_expected.to belong_to(:account) }
    it { is_expected.to have_many(:endorsements).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:policy) }

    it "validates uniqueness of policy_number" do
      existing = create(:policy)
      policy = build(:policy, policy_number: existing.policy_number)
      expect(policy).not_to be_valid
      expect(policy.errors[:policy_number]).to include("has already been taken")
    end
    it { is_expected.to validate_presence_of(:insurance_type) }
    it { is_expected.to validate_inclusion_of(:status).in_array(%w[draft active expired cancelled]) }
    it { is_expected.to validate_presence_of(:premium) }
    it { is_expected.to validate_numericality_of(:premium).only_integer.is_greater_than(0) }
    it { is_expected.to validate_presence_of(:coverage) }
    it { is_expected.to validate_numericality_of(:coverage).only_integer.is_greater_than(0) }
    it { is_expected.to validate_presence_of(:effective_date) }
    it { is_expected.to validate_presence_of(:expiration_date) }
  end

  describe "insurance_type enum" do
    it "defines the expected values" do
      expect(described_class.insurance_types).to eq(
        "general_liability" => "general_liability",
        "professional_liability" => "professional_liability",
        "commercial_property" => "commercial_property",
        "business_owners" => "business_owners"
      )
    end
  end

  describe "expiration validation" do
    it "is invalid if expiration_date is before effective_date" do
      policy = build(:policy, effective_date: Date.current, expiration_date: 1.day.ago.to_date)
      expect(policy).not_to be_valid
      expect(policy.errors[:expiration_date]).to include("must be after effective date")
    end
  end

  describe "auto-generated policy number" do
    it "generates a policy number on create" do
      policy = create(:policy, policy_number: nil)
      expect(policy.policy_number).to match(/\APOL-[A-F0-9]{8}\z/)
    end
  end

  describe "scopes" do
    it ".active returns only active policies" do
      active = create(:policy, status: "active")
      create(:policy, :draft)
      expect(described_class.active).to eq([active])
    end
  end
end
