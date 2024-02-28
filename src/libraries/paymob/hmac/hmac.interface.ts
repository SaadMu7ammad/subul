export interface Idata {
  amount_cents: string;
  created_at: string;
  currency: string;
  error_occured: string;
  has_parent_transaction: string;
  id: string;
  integration_id: string;
  is_3d_secure: string;
  is_auth: string;
  is_capture: string;
  is_refunded: string;
  is_standalone_payment: string;
  is_voided: string;
  pending: string;
  order_id: string; //order.id
  owner: string;
  source_data_pan: string; //source_data.pan in docs
  source_data_sub_type: string; //source_data.sub_type in docs
  source_data_type: string; //source_data.type in docs
  success: string;
}
