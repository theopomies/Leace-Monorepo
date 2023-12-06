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
  createPayment: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        amount: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: "2022-11-15" },
        );

        const paymentIntent = await stripe.paymentIntents.create({
          amount: input.amount,
          currency: "eur",
          customer: customer.id,
          metadata: {
            reason: "subscription",
          },
          payment_method_types: ["card"],
          confirm: false,
        });

        return {
          paymentIntentId: paymentIntent.id,
          paymentIntentClientSecret: paymentIntent.client_secret,
          customerId: customer.id,
          ephemeralKey: ephemeralKey.secret,
          publishableKey: process.env.STRIPE_PK,
        };
      } catch (error) {
        console.error("Error creating payment:", error);
        throw new Error("Failed to create payment");
      }
    }),

  confirmPayment: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        paymentIntentId: z.string(),
        customer: z.string(),
        name: z.string(),
        amount: z.number(),
        interval: z.enum(["year", "month"]),
      }),
    )
    .mutation(async ({ input }) => {
      const product = await stripe.products.create({
        name: input.name,
      });

      const price = await stripe.prices.create({
        unit_amount: input.amount,
        currency: "eur",
        recurring: { interval: input.interval },
        product: product.id,
      });

      const subscription = await stripe.subscriptions.create({
        customer: input.customer,
        items: [
          {
            price: price.id,
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      return {
        subscriptionId: subscription.id,
      };
    }),

  cancelPayment: protectedProcedure([Role.TENANT])
    .input(
      z.object({
        subscriptionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await stripe.subscriptions.update(input.subscriptionId, {
        cancel_at_period_end: true,
      });
    }),
});
