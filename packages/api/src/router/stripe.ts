import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { Stripe } from "stripe";

const secret = process.env.STRIPE_SK as string;

const stripe = new Stripe(secret, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const stripeRouter = router({
  createPayment: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ amount: z.number() }))
    .query(async ({ input }) => {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2022-11-15" },
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amount,
        currency: "eur",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        paymentIntent: paymentIntent.client_secret,
        customerId: customer.id,
        ephemeralKey: ephemeralKey.secret,
        publishableKey: process.env.STRIPE_PK,
      };
    }),
});
