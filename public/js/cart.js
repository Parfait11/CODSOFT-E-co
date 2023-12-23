const CartItems = document.querySelector(".cart-items");
// const payBtn = document.querySelector('.add_to_cart');
const payBtn = document.querySelector('.pay_now');



let cartTotal = 0;

function displayCartItems(items) {
    items.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart_item";
        cartItem.innerHTML = `
            <p class="cart_id">${item.id}</p>
            <p class="cart_title">${item.title}</p>
            <img src="${item.image}" alt="${item.title}" class="cart_img" />
            <p class="cart_price">${item.price}</p>
            <p class="cart_delete">Delete</p>
        `;
        CartItems.appendChild(cartItem);
    });
}
payBtn.addEventListener('click', () => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];

    // Create a Stripe Checkout session
    fetch('/stripe-checkout', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            items: items,
        }),
    })
    .then((res) => res.json())
    .then((session) => {
        // Redirect to the Stripe Checkout page
        stripe.redirectToCheckout({ sessionId: session.id });
    })
    .catch((err) => console.log(err));
});


// Chargement initial du panier
const items = JSON.parse(localStorage.getItem("cart-items")) || [];
displayCartItems(items);
