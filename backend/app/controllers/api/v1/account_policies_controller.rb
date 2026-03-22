# frozen_string_literal: true

module Api
  module V1
    class AccountPoliciesController < BaseController
      def index
        account = Account.find(params[:account_id])
        policies = account.policies.order(created_at: :desc)
        pagy, policies = pagy(policies)
        render json: {
          data: sorted(policies.as_json),
          meta: pagy_metadata(pagy)
        }
      end
    end
  end
end
