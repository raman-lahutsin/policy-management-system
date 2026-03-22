# frozen_string_literal: true

class DropClaims < ActiveRecord::Migration[8.1]
  def change
    drop_table :claims, force: :cascade
  end
end
