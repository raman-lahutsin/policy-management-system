# frozen_string_literal: true

require "rails_helper"

RSpec.describe Account do
  describe "associations" do
    it { is_expected.to have_many(:policies).dependent(:restrict_with_error) }
  end

  describe "validations" do
    subject { build(:account) }

    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  end

  describe "#address" do
    it "returns address fields as a hash" do
      account = build(:account, address_line1: "123 Main St", city: "Springfield", state: "IL", zip_code: "62701")
      expect(account.address).to eq(
        address_line1: "123 Main St",
        address_line2: nil,
        city: "Springfield",
        state: "IL",
        zip_code: "62701"
      )
    end
  end

  describe "email normalization" do
    it "downcases and strips email" do
      account = create(:account, email: "  TEST@Example.COM  ")
      expect(account.email).to eq("test@example.com")
    end
  end
end
