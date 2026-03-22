# frozen_string_literal: true

require "rails_helper"

RSpec.describe Endorsement do
  describe "associations" do
    it { is_expected.to belong_to(:policy) }
  end

  describe "validations" do
    subject { build(:endorsement) }

    it { is_expected.to validate_presence_of(:endorsement_type) }
    it { is_expected.to validate_presence_of(:effective_date) }
    it { is_expected.to validate_presence_of(:premium) }
    it { is_expected.to validate_numericality_of(:premium).only_integer }
    it { is_expected.to validate_presence_of(:description) }
  end

  describe "endorsement_type enum" do
    it "defines the expected values" do
      expect(described_class.endorsement_types).to eq(
        "policy_change" => "policy_change",
        "cancellation" => "cancellation",
        "reinstatement" => "reinstatement"
      )
    end
  end

  describe "premium can be negative" do
    it "allows negative premium for cancellations" do
      endorsement = build(:endorsement, premium: -500)
      expect(endorsement).to be_valid
    end
  end
end
