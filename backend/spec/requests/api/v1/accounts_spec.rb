# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Accounts" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /api/v1/accounts" do
    before { create_list(:account, 3) }

    it "returns a paginated list of accounts with nested address" do
      get "/api/v1/accounts", headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["data"].length).to eq(3)
      expect(json["data"].first["address"]).to include("address_line1", "city", "state", "zip_code")
      expect(json["meta"]).to include("current_page", "total_pages", "total_count")
    end
  end

  describe "POST /api/v1/accounts" do
    let(:valid_params) do
      {
        account: {
          first_name: "Jane",
          last_name: "Doe",
          email: "jane@example.com",
          phone: "555-0100",
          address: {
            address_line1: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip_code: "62701"
          }
        }
      }
    end

    it "creates an account with nested address" do
      post "/api/v1/accounts", params: valid_params, headers: headers

      expect(response).to have_http_status(:created)
      data = response.parsed_body["data"]
      expect(data["email"]).to eq("jane@example.com")
      expect(data["address"]["address_line1"]).to eq("123 Main St")
      expect(data["address"]["city"]).to eq("Springfield")
    end

    it "returns errors for invalid params" do
      post "/api/v1/accounts", params: { account: { first_name: "" } }, headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "GET /api/v1/accounts/:id" do
    let(:account) { create(:account) }

    it "returns the account with nested address" do
      get "/api/v1/accounts/#{account.id}", headers: headers

      expect(response).to have_http_status(:ok)
      data = response.parsed_body["data"]
      expect(data["id"]).to eq(account.id)
      expect(data["address"]).to be_present
      expect(data).not_to have_key("address_line1")
    end
  end

  describe "PATCH /api/v1/accounts/:id" do
    let(:account) { create(:account) }

    it "updates the account address" do
      patch "/api/v1/accounts/#{account.id}",
            params: { account: { address: { city: "Chicago" } } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]["address"]["city"]).to eq("Chicago")
    end
  end

  describe "DELETE /api/v1/accounts/:id" do
    let!(:account) { create(:account) }

    it "deletes the account" do
      delete "/api/v1/accounts/#{account.id}", headers: headers

      expect(response).to have_http_status(:no_content)
      expect(Account.find_by(id: account.id)).to be_nil
    end
  end
end
