import stripe from "../../../Utils/Stripe/stripe.js";

export const getMySubscriptions = async (req, res) => {
  try {
    const customerId = req.user.StripeId;

    if (!customerId) {
      return res.status(400).json({ message: "No Stripe customer ID linked to this user." });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all', // or 'active' only
      limit: 10,
    });
    if (!subscriptions.data.length) return res.json({subscriptions:[]});

    const productId=subscriptions.data[0].plan.product
    const product = await stripe.products.retrieve(productId);
    const productName = product.name; 
    res.status(200).json({ subscriptions:productName  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Session = async (req, res) => {
  try {
    const customerId = req.user.StripeId;
    const { priceId }  =req.query;

    if (!customerId) {
      return res.status(400).json({ message: "No Stripe customer ID linked to this user." });
    }

    const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:8080/",
      cancel_url: "http://localhost:8080/",
      customer:customerId,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

