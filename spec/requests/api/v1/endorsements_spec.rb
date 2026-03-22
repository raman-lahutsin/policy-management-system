# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Endorsements" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:policy) { create(:policy) }

  describe "GET /api/v1/policies/:policy_id/endorsements" do
    before { create_list(:endorsement, 2, policy: policy) }

    it "returns endorsements for the policy" do
      get "/api/v1/policies/#{policy.id}/endorsements", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"].length).to eq(2)
    end
  end

  describe "POST /api/v1/policies/:policy_id/endorsements" do
    let(:valid_params) do
      {
        endorsement: {
          endorsement_type: "policy_change",
          effective_date: Date.current,
          premium: 250,
          description: "Added additional coverage"
        }
      }
    end

    it "creates an endorsement" do
      post "/api/v1/policies/#{policy.id}/endorsements", params: valid_params, headers: headers

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["data"]["endorsement_type"]).to eq("policy_change")
    end

    it "allows negative premium" do
      params = { endorsement: { endorsement_type: "cancellation", effective_date: Date.current, premium: -500, description: "Policy cancelled" } }
      post "/api/v1/policies/#{policy.id}/endorsements", params: params, headers: headers

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["data"]["premium"]).to eq(-500)
    end
  end

  describe "GET /api/v1/endorsements/:id" do
    let(:endorsement) { create(:endorsement, policy: policy) }

    it "returns the endorsement" do
      get "/api/v1/endorsements/#{endorsement.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]["id"]).to eq(endorsement.id)
    end
  end

  describe "PATCH /api/v1/endorsements/:id" do
    let(:endorsement) { create(:endorsement, policy: policy) }

    it "updates the endorsement" do
      patch "/api/v1/endorsements/#{endorsement.id}",
            params: { endorsement: { description: "Updated description" } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]["description"]).to eq("Updated description")
    end
  end
end
