# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Authenticatable
  include Pagy::Backend

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found
    render json: { error: "Not found" }, status: :not_found
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def pagy_metadata(pagy)
    {
      current_page: pagy.page,
      total_count: pagy.count,
      total_pages: pagy.pages
    }
  end

  def sorted(record_or_hash)
    case record_or_hash
    when Hash
      record_or_hash.sort_by { |k, _| k.to_s }.to_h.transform_values { |v| sorted(v) }
    when Array
      record_or_hash.map { |item| sorted(item) }
    else
      record_or_hash
    end
  end
end
