const { sendSuccess } = require("../../utils/apiResponse");
const billingService = require("./billing.service");

const getStatus = async (req, res, next) => {
  try {
    const status = await billingService.getBillingStatus(req.user);
    return sendSuccess(res, status, "Billing status");
  } catch (error) {
    next(error);
  }
};

module.exports = { getStatus };
