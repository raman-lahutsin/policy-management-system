# frozen_string_literal: true

class CreatePolicies < ActiveRecord::Migration[8.1]
  def change
    create_table :policies do |t|
      t.string :policy_number, null: false
      t.references :customer, null: false, foreign_key: true
      t.references :policy_type, null: false, foreign_key: true
      t.string :status, null: false, default: "draft"
      t.decimal :premium_amount, precision: 10, scale: 2, null: false
      t.decimal :coverage_amount, precision: 12, scale: 2, null: false
      t.date :effective_date, null: false
      t.date :expiration_date, null: false
      t.text :notes

      t.timestamps
    end

    add_index :policies, :policy_number, unique: true
    add_index :policies, :status
    add_index :policies, [:effective_date, :expiration_date]
  end
end
