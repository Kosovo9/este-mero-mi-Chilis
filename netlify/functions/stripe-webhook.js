const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    const sig = event.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;

    try {
        // IMPORTANTE: Se usa event.body tal cual para verificar la firma
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;
        console.log(`[Stripe] ✅ Payment confirmed for session: ${session.id}`);

        // Aquí es donde Zapier o Buffer recibirían la señal vía Webhook si fuera necesario
        // O simplemente marcamos en DB el estado como PAID
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
    };
};
