# frozen_string_literal: true

class Account < ApplicationRecord
  has_many :policies, dependent: :restrict_with_error

  validates :first_name, :last_name, :email, presence: true
  validates :email, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  normalizes :email, with: ->(email) { email.strip.downcase }

  ADDRESS_FIELDS = %w[address_line1 address_line2 city state zip_code].freeze

  def address
    {
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      zip_code: zip_code
    }
  end
end
