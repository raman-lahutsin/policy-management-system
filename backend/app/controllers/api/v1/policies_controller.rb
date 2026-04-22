# frozen_string_literal: true

module Api
  module V1
    class PoliciesController < BaseController
      before_action :set_policy, only: [:show, :update, :destroy]

      def index
        policies = Policy.includes(:account).order(:id)
        pagy, policies = pagy(policies)
        render json: {
          data: sorted(policies.as_json(include: {
            account: { only: [:id, :first_name, :last_name] }
          })),
          meta: pagy_metadata(pagy)
        }
      end

      def show
        render json: {
          data: sorted(@policy.as_json(include: {
            account: { only: [:id, :first_name, :last_name, :email] },
            endorsements: { only: [:id, :endorsement_type, :effective_date, :premium] }
          }))
        }
      end

      def create
        policy = Policy.new(policy_params)
        if policy.save
          render json: { data: sorted(policy.as_json) }, status: :created
        else
          render json: { errors: policy.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @policy.update(policy_params)
          render json: { data: sorted(@policy.as_json) }
        else
          render json: { errors: @policy.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @policy.destroy
          head :no_content
        else
          render json: { errors: @policy.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_policy
        @policy = Policy.find(params[:id])
      end

      def policy_params
        params.require(:policy).permit(
          :account_id, :insurance_type, :status,
          :premium, :coverage,
          :effective_date, :expiration_date
        )
      end
    end
  end
end
