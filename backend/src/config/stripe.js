const Stripe = require("stripe");
const env = require("./env");

const getStripeClient = () => {
  if (!env.stripeSecretKey) return null;
  return new Stripe(env.stripeSecretKey);
};

module.exports = { getStripeClient };
