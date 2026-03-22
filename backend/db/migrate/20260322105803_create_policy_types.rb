# frozen_string_literal: true

class CreatePolicyTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :policy_types do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    add_index :policy_types, :name, unique: true
  end
end
