// Load Cart
const cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(window.db);
const summaryItems = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");

// Display Order
function loadOrder() {

    let total = 0;
    summaryItems.innerHTML = "";

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

    const customer_name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const table_number = document.getElementById("tableNumber").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!customer_name || !phone) {
        alert("Please enter customer name and phone number.");
        return;
    }

    const items = JSON.parse(localStorage.getItem("cart")) || [];

    if (items.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const total = items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    try {

        const { data, error } = await window.db
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
    ])
    .select();

        console.log(data);
        console.log(error);

        if (error) {
            alert("Order failed: " + error.message);
            return;
        }

        localStorage.removeItem("cart");

        window.location.href = "success.html";

    } catch (err) {

        alert("JavaScript Error: " + err.message);
        console.error(err);

    }

}
