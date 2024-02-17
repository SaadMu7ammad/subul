import { BadRequestError } from '../../errors/components/index.js';
import { hmacService } from './hmac.service.js';
import * as configurationProvider from '../../configuration-provider/index.js';
const hmacSetting = (req, res, next) => {
  // Extract HMAC from query parameter
  const receivedHMAC = req.query.hmac;
  // Extract required data from request body
  const data = {
    amount_cents: req.body.obj.amount_cents,
    created_at: req.body.obj.created_at,
    currency: req.body.obj.currency,
    error_occured: req.body.obj.error_occured,
    has_parent_transaction: req.body.obj.has_parent_transaction,
    id: req.body.obj.id, //obj.id
    integration_id: req.body.obj.integration_id,
    is_3d_secure: req.body.obj.is_3d_secure,
    is_auth: req.body.obj.is_auth,
    is_capture: req.body.obj.is_capture,
    is_refunded: req.body.obj.is_refunded,
    is_standalone_payment: req.body.obj.is_standalone_payment,
    is_voided: req.body.obj.is_voided,
    order_id: req.body.obj.order.id, //order.id
    owner: req.body.obj.owner,
    pending: req.body.obj.pending,
    source_data_pan: req.body.obj.source_data.pan, //source_data.pan in docs
    source_data_sub_type: req.body.obj.source_data.sub_type, //source_data.sub_type in docs
    source_data_type: req.body.obj.source_data.type, //source_data.type in docs
    success: req.body.obj.success,
  };
  // Calculate HMAC based on your secret key and data
  const calculatedHMAC = hmacService.calculateHMAC(
    data,
    configurationProvider.getValue('paymob.hmacSecret')
  );
  // Compare HMACs and proceed accordingly
  if (calculatedHMAC === receivedHMAC) {
    console.log('Valid HMAC signature. Proceeding to next middleware.');
    next();
  } else {
    throw new BadRequestError('Invalid HMAC signature');
  }
};

export { hmacSetting };
