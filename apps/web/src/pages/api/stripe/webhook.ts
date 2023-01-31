import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import rawBody from "raw-body";

import { stripe } from "../../../utils/stripe";
import { prisma } from "@leace/db";

export const config = {
  api: {
    // Turn off the body parser so we can access raw body for verification.
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = await rawBody(req);
  const signature = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session.client_reference_id) {
      return res.status(400).send(`Error with client_reference_id: ${session}`);
    }
    console.log(`${session.client_reference_id} is now a premium user!`);
    await prisma.user.update({
      where: { id: session.client_reference_id },
      data: { isPremium: true },
    });
  }

  return res.json({});
}
