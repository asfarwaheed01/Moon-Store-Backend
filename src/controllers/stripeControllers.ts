import express, { Request, Response } from "express";
import Stripe from "stripe";
import asyncHandler from "../middleware/asyncHandler";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-04-10",
//   typescript: true,
// });
const stripe = new Stripe(
  "sk_test_51PEq9aI14C7BnuSwEmCc5MX5AKL9FdG8st6102c17PJRJuqmNRrhBdLn4TOAsLVjmTOr7VwoEpcEElGFa84QGt9s00e5SavtMs",
  {
    apiVersion: "2024-04-10",
    typescript: true,
  }
);

const payment = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: amount,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent?.client_secret,
    });
  } catch (error) {
    res.status(500).send({ message: "Error during Payment" });
  }
});

const config = asyncHandler(async (req: Request, res: Response) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  });
});

export { config, payment };
