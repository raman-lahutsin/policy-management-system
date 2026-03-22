# frozen_string_literal: true

# Create default admin user
User.find_or_create_by!(email: "admin@example.com") do |u|
  u.first_name = "Admin"
  u.last_name = "User"
  u.password = "password123"
  u.password_confirmation = "password123"
  u.role = "admin"
end

puts "Seeded #{User.count} users"
