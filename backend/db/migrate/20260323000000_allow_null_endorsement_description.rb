class AllowNullEndorsementDescription < ActiveRecord::Migration[8.0]
  def change
    change_column_null :endorsements, :description, true
  end
end
