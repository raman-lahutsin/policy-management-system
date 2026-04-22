# frozen_string_literal: true

module Api
  module V1
    class EndorsementsController < BaseController
      before_action :set_policy, only: [:index, :create]
      before_action :set_endorsement, only: [:show, :update]

      # GET /api/v1/policies/:policy_id/endorsements
      def index
        endorsements = @policy.endorsements.order(created_at: :desc)
        pagy, endorsements = pagy(endorsements)
        render json: { data: sorted(endorsements.as_json(except: [:description])), meta: pagy_metadata(pagy) }
      end

      # GET /api/v1/endorsements/:id
      def show
        render json: {
          data: sorted(@endorsement.as_json(include: {
            policy: { only: [:id, :policy_number, :status] }
          }))
        }
      end

      # POST /api/v1/policies/:policy_id/endorsements
      def create
        endorsement = @policy.endorsements.new(endorsement_params)
        endorsement.effective_date = Date.current
        if endorsement.save
          render json: { data: sorted(endorsement.as_json) }, status: :created
        else
          render json: { errors: endorsement.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/endorsements/:id
      def update
        if @endorsement.update(endorsement_params)
          render json: { data: sorted(@endorsement.as_json) }
        else
          render json: { errors: @endorsement.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_policy
        @policy = Policy.find(params[:policy_id])
      end

      def set_endorsement
        @endorsement = Endorsement.find(params[:id])
      end

      def endorsement_params
        params.require(:endorsement).permit(
          :endorsement_type, :effective_date, :premium, :description, :policy_id
        )
      end
    end
  end
end
