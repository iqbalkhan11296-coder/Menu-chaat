const ordersDiv = document.getElementById("orders");

async function loadOrders() {

    const { data, error } = await window.db
        .from("kot") // Change to "kots" if your table name is kots
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
                    <div>${item.name} × ${item.quantity}</div>
                `;
            });
        }

        ordersDiv.innerHTML += `
        <div class="order-card">
            <h2>${order.kot_number}</h2>

            <p><strong>Customer:</strong> ${order.customer_name}</p>

            <p><strong>Table:</strong> ${order.table_number || "-"}</p>

            <p><strong>Time:</strong> ${new Date(order.created_at).toLocaleTimeString()}</p>

            <div class="items">
                ${itemsHTML}
            </div>

            <p><strong>Total:</strong> ₹${order.total}</p>

            <p><strong>Status:</strong> ${order.status}</p>

            <button class="preparing" onclick="updateStatus(${order.id},'Preparing')">
                Preparing
            </button>

            <button class="ready" onclick="updateStatus(${order.id},'Ready')">
                Ready
            </button>

            <button class="complete" onclick="updateStatus(${order.id},'Completed')">
                Completed
            </button>
        </div>`;
    });
}

async function updateStatus(id, status) {

    const { error } = await window.db
        .from("kot") // Change to "kots" if needed
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error(error);
    }

    loadOrders();
}

// Initial load
loadOrders();

// Auto refresh every 2 seconds
setInterval(loadOrders, 2000);

// Realtime updates
window.db
    .channel("kitchen-orders")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "kot" // Change to "kots" if needed
        },
        () => {
            loadOrders();
        }
    )
    .subscribe();
