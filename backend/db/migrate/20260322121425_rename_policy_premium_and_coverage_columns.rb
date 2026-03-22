class RenamePolicyPremiumAndCoverageColumns < ActiveRecord::Migration[8.1]
  def change
    rename_column :policies, :premium_amount, :premium
    rename_column :policies, :coverage_amount, :coverage
  end
end
