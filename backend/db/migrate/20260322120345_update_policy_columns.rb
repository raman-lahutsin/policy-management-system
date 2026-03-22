class UpdatePolicyColumns < ActiveRecord::Migration[8.1]
  def change
    remove_column :policies, :notes, :text
    change_column :policies, :premium_amount, :integer, using: "premium_amount::integer"
    change_column :policies, :coverage_amount, :integer, using: "coverage_amount::integer"
  end
end
