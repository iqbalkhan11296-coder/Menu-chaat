const ordersDiv = document.getElementById("orders");

async function loadOrders() {

    const { data, error } = await window.db
        .from("kot") // Change to "kots" if that's your table name
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    ordersDiv.innerHTML = "";

    data.forEach(order => {

        let itemsHTML = "";

        if (Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemsHTML += `
                    <div>
                        ${item.name} × ${item.quantity}
                    </div>
                `;
            });
        }

        ordersDiv.innerHTML += `
        <div class="order-card">
            <h2>${order.kot_number}</h2>

            <p><strong>Customer:</strong> ${order.customer_name}</p>

            <p><strong>Table:</strong> ${order.table_number}</p>

            <div class="items">
                ${itemsHTML}
            </div>

            <p><strong>Total:</strong> ₹${order.total}</p>

            <p><strong>Status:</strong> ${order.status}</p>

            <button class="preparing"
                onclick="updateStatus(${order.id},'Preparing')">
                Preparing
            </button>

            <button class="ready"
                onclick="updateStatus(${order.id},'Ready')">
                Ready
            </button>

            <button class="complete"
                onclick="updateStatus(${order.id},'Completed')">
                Completed
            </button>

        </div>`;
    });
}

async function updateStatus(id, status) {

    await window.db
        .from("kot") // Change to "kots" if that's your table name
        .update({ status })
        .eq("id", id);

    loadOrders();
}

loadOrders();

// Refresh every 2 seconds
setInterval(loadOrders, 2000);
