// import userModel from "../../../DB/Model/user.model.js"
import stripe from "../../../Utils/Stripe/stripe.js";


export default async function Profile(req, res) {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    const customerId = userData.StripeId;

    if (!customerId) {
      return res.status(400).json({ message: "No Stripe customer ID linked to this user." });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });

    if (!subscriptions.data.length) {
      return res.status(200).json({
        name: userData.userName,
        email: userData.email,
        isEmailVerified: userData.isEmailVerified,
        subscription: "No Subscription",
      });
    }

    const productId = subscriptions.data[0].plan.product;
    const product = await stripe.products.retrieve(productId);
    const productName = product.name;

    res.status(200).json({
      name: userData.userName,
      email: userData.email,
      isEmailVerified: userData.isEmailVerified,
      subscription: productName,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}