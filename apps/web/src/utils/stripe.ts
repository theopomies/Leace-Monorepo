import Stripe from "stripe";

export const stripe: Stripe = (() => {
  console.log({ env: process.env });
  return new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "", {
    apiVersion: "2022-11-15",
    typescript: true,
  });
})();
