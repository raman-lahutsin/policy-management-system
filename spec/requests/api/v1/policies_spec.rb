# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Policies" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /api/v1/policies" do
    before { create_list(:policy, 3) }

    it "returns a paginated list of policies" do
      get "/api/v1/policies", headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["data"].length).to eq(3)
      expect(json["meta"]).to include("current_page", "total_pages", "total_count")
    end
  end

  describe "POST /api/v1/policies" do
    let(:account) { create(:account) }
    let(:valid_params) do
      {
        policy: {
          account_id: account.id,
          insurance_type: "general_liability",
          status: "active",
          premium: 1500,
          coverage: 100_000,
          effective_date: Date.current,
          expiration_date: 1.year.from_now.to_date
        }
      }
    end

    it "creates a policy" do
      post "/api/v1/policies", params: valid_params, headers: headers

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["data"]["policy_number"]).to be_present
      expect(response.parsed_body["data"]["insurance_type"]).to eq("general_liability")
    end
  end

  describe "GET /api/v1/policies/:id" do
    let(:policy) { create(:policy) }

    it "returns the policy with associations" do
      get "/api/v1/policies/#{policy.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body["data"]
      expect(json["account"]).to be_present
      expect(json["insurance_type"]).to be_present
    end
  end

  describe "PATCH /api/v1/policies/:id" do
    let(:policy) { create(:policy) }

    it "updates the policy" do
      patch "/api/v1/policies/#{policy.id}",
            params: { policy: { status: "cancelled" } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]["status"]).to eq("cancelled")
    end
  end

  describe "DELETE /api/v1/policies/:id" do
    let!(:policy) { create(:policy) }

    it "deletes the policy" do
      delete "/api/v1/policies/#{policy.id}", headers: headers

      expect(response).to have_http_status(:no_content)
    end
  end
end
