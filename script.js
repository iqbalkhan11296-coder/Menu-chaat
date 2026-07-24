// Cart Array
let cart = [];

// Add Item to Cart
function addToCart(name, price) {

    const item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

}

// Update Cart Counter
function updateCart() {

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    document.getElementById("cart-count").innerText = totalItems;

    // Save cart in browser
    localStorage.setItem("cart", JSON.stringify(cart));

}

// Load Cart When Page Opens
window.onload = function () {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

};

// View Cart (temporary)
document.getElementById("cart-btn").addEventListener("click", function () {

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let message = "🛒 Your Cart\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} x${item.quantity} = ₹${item.price * item.quantity}\n`;
        total += item.price * item.quantity;
    });

    message += "\n------------------";
    message += `\nTotal: ₹${total}`;

    alert(message);

});
