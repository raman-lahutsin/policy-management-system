# frozen_string_literal: true

module AuthHelpers
  def auth_headers(user = nil)
    user ||= create(:user)
    token = JwtService.encode(user_id: user.id)
    { "Authorization" => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
