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
async function placeOrder() {

    const customer_name = document.getElementById("customerName").value;
    const phone = document.getElementById("phone").value;
    const table_number = document.getElementById("tableNumber").value;
    const notes = document.getElementById("notes").value;

    const items = JSON.parse(localStorage.getItem("cart")) || [];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { error } = await supabase
        .from("orders")
        .insert([
            {
                customer_name,
                phone,
                table_number,
                notes,
                items,
                total,
                status: "New"
            }
        ]);

    if (error) {
        alert("Order failed: " + error.message);
        return;
    }

    localStorage.removeItem("cart");
    window.location.href = "success.html";
}

    // Temporary storage
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // Clear cart
    localStorage.removeItem("cart");

    alert("✅ Order Placed Successfully!");

    window.location.href="success.html";

});
