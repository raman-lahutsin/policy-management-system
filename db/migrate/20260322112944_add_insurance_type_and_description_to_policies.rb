# frozen_string_literal: true

class AddInsuranceTypeAndDescriptionToPolicies < ActiveRecord::Migration[8.1]
  def change
    add_column :policies, :insurance_type, :string, null: false, default: "general_liability"
    add_column :policies, :description, :text
    remove_reference :policies, :policy_type, foreign_key: true
    add_index :policies, :insurance_type
  end
end
