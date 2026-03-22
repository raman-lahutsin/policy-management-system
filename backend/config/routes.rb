# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      post "auth/register", to: "auth#register"
      post "auth/login",    to: "auth#login"
      get  "auth/me",       to: "auth#me"

      # Resources
      resources :accounts do
        resources :policies, only: [:index], controller: "account_policies"
      end

      resources :policies do
        resources :endorsements, only: [:index, :create]
      end

      resources :endorsements, only: [:show, :update]
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
