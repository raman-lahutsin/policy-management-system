class ChangeEndorsementPremiumToInteger < ActiveRecord::Migration[8.1]
  def change
    change_column :endorsements, :premium, :integer, using: "premium::integer"
  end
end
