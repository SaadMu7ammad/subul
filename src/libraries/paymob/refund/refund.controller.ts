import { refundService } from './refund.service.js';

const refund = (async (req, res, next) => {
  const { id }:{id:string} = req.params;
  const response = await refundService.refund(id);
  return { response };
});

export { refund };
