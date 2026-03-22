# frozen_string_literal: true

class RenameCustomersToAccounts < ActiveRecord::Migration[8.1]
  def change
    rename_table :customers, :accounts
    rename_column :policies, :customer_id, :account_id
  end
end
