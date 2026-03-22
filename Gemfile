source "https://rubygems.org"

ruby "~> 3.4"

# Core
gem "rails", "~> 8.1.2"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "bootsnap", require: false

# Authentication
gem "bcrypt", "~> 3.1"
gem "jwt", "~> 2.8"

# API
gem "rack-cors", "~> 3.0"
gem "pagy", "~> 9.0"

# Windows timezone data
gem "tzinfo-data", platforms: %i[windows jruby]

# Deployment
gem "kamal", require: false
gem "thruster", require: false

# Background jobs & caching
gem "solid_cache"
gem "solid_queue"

group :development, :test do
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "bundler-audit", require: false
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false

  # Testing
  gem "rspec-rails", "~> 7.0"
  gem "factory_bot_rails", "~> 6.0"
  gem "faker", "~> 3.0"

  # Environment
  gem "dotenv-rails", "~> 3.0"
end

group :test do
  gem "shoulda-matchers", "~> 6.0"
  gem "database_cleaner-active_record", "~> 2.0"
  gem "simplecov", require: false
end
