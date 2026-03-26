const { getStripeClient } = require("../../config/stripe");

const getBillingStatus = async (user) => {
  const stripe = getStripeClient();
  return {
    enabled: Boolean(stripe),
    plan: user.plan,
    message: stripe ? "Stripe integration is ready for expansion" : "Stripe is not configured"
  };
};

module.exports = { getBillingStatus };
