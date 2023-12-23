import dotenv from 'dotenv';
import express from 'express';
import stripe from 'stripe';

// Load variables
dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});


// cart route
app.get("/cart", (req, res) => {
    res.sendFile("cart.html", { root: "public" });
});

// login route
app.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "public" });
});

// signup route
app.get("/sign-up", (req, res) => {
    res.sendFile("sign-up.html", { root: "public" });
});
//Stripe
// let stripeGateway = stripe(process.env.stripe_api);
let stripeGateway = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });




let DOMAIN = process.env.DOMAIN;


// app.use(bodyParser.json());

app.post('/stripe-checkout', async (req, res) => {
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        images: [item.image]
                    },
                    unit_amount: unitAmount,
                },
                quantity: 1
            };
        });

        // Stripe session creation:
        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${DOMAIN}/success`,
            cancel_url: `${DOMAIN}/cancel`,
            line_items: lineItems,

            //asking adress in stripe checkout page
            billing_adress_collection: "required",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
