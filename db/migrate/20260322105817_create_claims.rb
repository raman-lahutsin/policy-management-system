# frozen_string_literal: true

class CreateClaims < ActiveRecord::Migration[8.1]
  def change
    create_table :claims do |t|
      t.string :claim_number, null: false
      t.references :policy, null: false, foreign_key: true
      t.string :status, null: false, default: "submitted"
      t.text :description, null: false
      t.date :incident_date, null: false
      t.decimal :claimed_amount, precision: 10, scale: 2, null: false
      t.decimal :approved_amount, precision: 10, scale: 2

      t.timestamps
    end

    add_index :claims, :claim_number, unique: true
    add_index :claims, :status
  end
end
