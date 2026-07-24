// Load Cart
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const summaryItems = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");

// Display Order
function loadOrder() {

    let total = 0;

    if (cart.length === 0) {

        summaryItems.innerHTML = "<p>Your cart is empty.</p>";

        return;
    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        summaryItems.innerHTML += `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
        `;

    });

    summaryTotal.innerText = total;

}

loadOrder();

// Submit Order
document
.getElementById("checkout-form")
.addEventListener("submit", function(e){

    e.preventDefault();

    const order = {

        customer: document.getElementById("name").value,

        phone: document.getElementById("phone").value,

        table: document.getElementById("table").value,

        note: document.getElementById("note").value,

        items: cart,

        total: summaryTotal.innerText,

        time: new Date().toLocaleString()

    };

    // Temporary storage
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // Clear cart
    localStorage.removeItem("cart");

    alert("✅ Order Placed Successfully!");

    window.location.href="success.html";

});
