# frozen_string_literal: true

module Api
  module V1
    class AuthController < BaseController
      wrap_parameters false
      skip_before_action :authenticate_request, only: [:login, :register]

      def register
        user = User.new(register_params)
        if user.save
          token = JwtService.encode(user_id: user.id)
          render json: { token: token, user: user_response(user) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email]&.downcase&.strip)
        if user&.authenticate(params[:password])
          user.update!(last_login_at: Time.current)
          token = JwtService.encode(user_id: user.id)
          render json: { token: token, user: user_response(user) }
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def me
        render json: { user: user_response(current_user) }
      end

      private

      def register_params
        params.permit(:email, :password, :password_confirmation, :first_name, :last_name)
      end

      def user_response(user)
        sorted(user.as_json(only: [:id, :email, :first_name, :last_name, :role]))
      end
    end
  end
end
