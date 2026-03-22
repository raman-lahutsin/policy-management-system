# frozen_string_literal: true

class CreateEndorsements < ActiveRecord::Migration[8.1]
  def change
    create_table :endorsements do |t|
      t.references :policy, null: false, foreign_key: true
      t.string :endorsement_type, null: false
      t.date :effective_date, null: false
      t.decimal :premium, precision: 10, scale: 2, null: false
      t.text :description, null: false

      t.timestamps
    end

    add_index :endorsements, :endorsement_type
  end
end
