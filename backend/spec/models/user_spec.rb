# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  describe "validations" do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_inclusion_of(:role).in_array(%w[agent admin]) }
    it { is_expected.to have_secure_password }
  end

  describe "email normalization" do
    it "downcases and strips email" do
      user = create(:user, email: "  TEST@Example.COM  ")
      expect(user.email).to eq("test@example.com")
    end
  end
end
