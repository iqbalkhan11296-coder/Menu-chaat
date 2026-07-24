if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
}
const ordersDiv = document.getElementById("orders");

async function loadOrders() {

    try {

        const { data, error } = await window.db
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            ordersDiv.innerHTML = "<p>Error: " + error.message + "</p>";
            return;
        }

        if (!data || data.length === 0) {
            ordersDiv.innerHTML = "<p>No customer orders yet.</p>";
            return;
        }

        let html = "";

        data.forEach(order => {

            html += `
                <div class="order-card">

                    <h3>${order.customer_name}</h3>

                    <p><strong>Phone:</strong> ${order.phone}</p>

                    <p><strong>Table:</strong> ${order.table_number || "-"}</p>

                    <p><strong>Status:</strong> ${order.status}</p>

                    <h4>Items</h4>
            `;

            if (order.items && order.items.length > 0) {

                order.items.forEach(item => {

                    html += `
                        <p>
                            ${item.name} × ${item.quantity}
                            = ₹${item.price * item.quantity}
                        </p>
                    `;

                });

            } else {

                html += `<p>No items found.</p>`;

            }

            html += `
                    <p><strong>Total: ₹${order.total}</strong></p>

                    <hr>

                </div>
            `;

        });

        ordersDiv.innerHTML = html;

    } catch (err) {

        ordersDiv.innerHTML =
            "<p>JavaScript Error: " + err.message + "</p>";

        console.error(err);

    }

}

// Load once when page opens
loadOrders();

// Auto refresh every 2 seconds
setInterval(loadOrders, 2000);
