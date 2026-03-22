# frozen_string_literal: true

class Policy < ApplicationRecord
  belongs_to :account
  has_many :endorsements, dependent: :destroy

  enum :insurance_type, {
    general_liability: "general_liability",
    professional_liability: "professional_liability",
    commercial_property: "commercial_property",
    business_owners: "business_owners"
  }

  validates :policy_number, presence: true, uniqueness: true
  validates :insurance_type, presence: true
  validates :status, inclusion: { in: %w[draft active expired cancelled] }
  validates :premium, :coverage, presence: true,
            numericality: { only_integer: true, greater_than: 0 }
  validates :effective_date, :expiration_date, presence: true
  validate :expiration_after_effective

  before_validation :generate_policy_number, on: :create

  scope :active, -> { where(status: "active") }
  scope :expiring_soon, ->(days = 30) {
    where(status: "active")
      .where(expiration_date: ..days.days.from_now.to_date)
  }

  private

  def generate_policy_number
    self.policy_number ||= "POL-#{SecureRandom.hex(4).upcase}"
  end

  def expiration_after_effective
    return unless effective_date && expiration_date

    if expiration_date <= effective_date
      errors.add(:expiration_date, "must be after effective date")
    end
  end
end
