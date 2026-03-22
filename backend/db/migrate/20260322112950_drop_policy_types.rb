# frozen_string_literal: true

class DropPolicyTypes < ActiveRecord::Migration[8.1]
  def change
    drop_table :policy_types, force: :cascade
  end
end
