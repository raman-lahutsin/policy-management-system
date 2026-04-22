# frozen_string_literal: true

module Api
  module V1
    class AccountsController < BaseController
      before_action :set_account, only: [:show, :update, :destroy]

      def index
        accounts = Account.order(:first_name)
        pagy, accounts = pagy(accounts)
        render json: { data: accounts.map { |a| sorted(account_json(a)) }, meta: pagy_metadata(pagy).merge(count: accounts.size) }
      end

      def show
        json = account_json(@account)
        json["policies"] = @account.policies.as_json(only: [:id, :policy_number, :status, :insurance_type, :effective_date, :expiration_date])
        render json: { data: sorted(json) }
      end

      def create
        account = Account.new(account_params)
        if account.save
          render json: { data: sorted(account_json(account)) }, status: :created
        else
          render json: { errors: account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @account.update(account_params)
          render json: { data: sorted(account_json(@account)) }
        else
          render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @account.destroy
          head :no_content
        else
          render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_account
        @account = Account.find(params[:id])
      end

      def account_params
        permitted = params.require(:account).permit(
          :first_name, :last_name, :email, :phone,
          address: [:address_line1, :address_line2, :city, :state, :zip_code]
        )
        if permitted[:address].present?
          permitted.merge!(permitted.delete(:address))
        end
        permitted
      end

      def account_json(account)
        json = account.as_json(except: Account::ADDRESS_FIELDS)
        json["address"] = account.address
        json
      end
    end
  end
end
