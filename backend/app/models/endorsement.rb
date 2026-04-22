# frozen_string_literal: true

class Endorsement < ApplicationRecord
  belongs_to :policy

  enum :endorsement_type, {
    policy_change: "policy_change",
    cancellation: "cancellation",
    reinstatement: "reinstatement"
  }

  validates :endorsement_type, presence: true
  validates :effective_date, presence: true
  validates :premium, presence: true, numericality: true
  validates :description, length: { maximum: 500 }
end
