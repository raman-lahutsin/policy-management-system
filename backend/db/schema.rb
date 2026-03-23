# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_22_121425) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "accounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "address_line1"
    t.string "address_line2"
    t.string "city"
    t.datetime "created_at", null: false
    t.date "date_of_birth"
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "phone"
    t.string "state"
    t.datetime "updated_at", null: false
    t.string "zip_code"
    t.index ["email"], name: "index_accounts_on_email", unique: true
    t.index ["last_name", "first_name"], name: "index_accounts_on_last_name_and_first_name"
  end

  create_table "endorsements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.date "effective_date", null: false
    t.string "endorsement_type", null: false
    t.uuid "policy_id", null: false
    t.integer "premium", null: false
    t.datetime "updated_at", null: false
    t.index ["endorsement_type"], name: "index_endorsements_on_endorsement_type"
    t.index ["policy_id"], name: "index_endorsements_on_policy_id"
  end

  create_table "policies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "account_id", null: false
    t.integer "coverage", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.date "effective_date", null: false
    t.date "expiration_date", null: false
    t.string "insurance_type", default: "general_liability", null: false
    t.string "policy_number", null: false
    t.integer "premium", null: false
    t.string "status", default: "draft", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_policies_on_account_id"
    t.index ["effective_date", "expiration_date"], name: "index_policies_on_effective_date_and_expiration_date"
    t.index ["insurance_type"], name: "index_policies_on_insurance_type"
    t.index ["policy_number"], name: "index_policies_on_policy_number", unique: true
    t.index ["status"], name: "index_policies_on_status"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "first_name", null: false
    t.datetime "last_login_at"
    t.string "last_name", null: false
    t.string "password_digest", null: false
    t.string "role", default: "agent", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "endorsements", "policies"
  add_foreign_key "policies", "accounts"
end
