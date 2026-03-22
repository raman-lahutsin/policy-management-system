# frozen_string_literal: true

class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :phone
      t.date :date_of_birth
      t.string :address_line1
      t.string :address_line2
      t.string :city
      t.string :state
      t.string :zip_code

      t.timestamps
    end

    add_index :customers, :email, unique: true
    add_index :customers, [:last_name, :first_name]
  end
end
