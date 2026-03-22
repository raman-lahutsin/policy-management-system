# frozen_string_literal: true

class SwitchToUuids < ActiveRecord::Migration[8.1]
  def up
    enable_extension "pgcrypto"

    # Drop dependent tables first (order matters for FKs)
    drop_table :endorsements, force: :cascade
    drop_table :policies, force: :cascade
    drop_table :accounts, force: :cascade
    drop_table :users, force: :cascade

    # Recreate all tables with UUID primary keys
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :role, null: false, default: "agent"
      t.datetime :last_login_at

      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :accounts, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
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
    add_index :accounts, :email, unique: true
    add_index :accounts, [:last_name, :first_name]

    create_table :policies, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :policy_number, null: false
      t.references :account, null: false, foreign_key: true, type: :uuid
      t.string :insurance_type, null: false, default: "general_liability"
      t.string :status, null: false, default: "draft"
      t.decimal :premium_amount, precision: 10, scale: 2, null: false
      t.decimal :coverage_amount, precision: 12, scale: 2, null: false
      t.date :effective_date, null: false
      t.date :expiration_date, null: false
      t.text :description
      t.text :notes

      t.timestamps
    end
    add_index :policies, :policy_number, unique: true
    add_index :policies, :status
    add_index :policies, :insurance_type
    add_index :policies, [:effective_date, :expiration_date]

    create_table :endorsements, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :policy, null: false, foreign_key: true, type: :uuid
      t.string :endorsement_type, null: false
      t.date :effective_date, null: false
      t.decimal :premium, precision: 10, scale: 2, null: false
      t.text :description, null: false

      t.timestamps
    end
    add_index :endorsements, :endorsement_type
  end

  def down
    drop_table :endorsements, force: :cascade
    drop_table :policies, force: :cascade
    drop_table :accounts, force: :cascade
    drop_table :users, force: :cascade

    disable_extension "pgcrypto"
  end
end
