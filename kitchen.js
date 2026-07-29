const newOrderSound = document.getElementById("newOrderSound");
let lastOrderCount = 0;

const ordersDiv = document.getElementById("orders");

// ============================
// ORDER TIMER
// ============================

function getOrderTimer(createdAt) {

    const created = new Date(createdAt);
    const now = new Date();

    const minutes = Math.floor((now - created) / 60000);

    let color = "#4CAF50";

    if (minutes >= 5) color = "#FFC107";
    if (minutes >= 10) color = "#F44336";

    return `
        <div style="
            margin:10px 0;
            padding:8px;
            border-radius:8px;
            background:${color};
            color:#fff;
            text-align:center;
            font-weight:bold;
            font-size:18px;
        ">
            ⏱ ${minutes} min
        </div>
    `;
}

// ============================
// LOAD ORDERS
// ============================

async function loadOrders() {

    const { data, error } = await window.db
        .from("kot") // Change to "kots" if needed
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    // Notification sound
    if (lastOrderCount > 0 && data.length > lastOrderCount) {
        newOrderSound.play().catch(err => console.log(err));
    }

    lastOrderCount = data.length;

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

            ${getOrderTimer(order.created_at)}

            <div class="items">
                ${itemsHTML}
            </div>

            <p><strong>Total:</strong> ₹${order.total}</p>

            <p><strong>Status:</strong> ${order.status}</p>

            <button class="preparing"
                onclick="updateStatus(${order.id}, 'Preparing')">
                Preparing
            </button>

            <button class="ready"
                onclick="updateStatus(${order.id}, 'Ready')">
                Ready
            </button>

            <button class="complete"
                onclick="updateStatus(${order.id}, 'Completed')">
                Completed
            </button>
            <button onclick="printKOT(${order.id})">
    🖨️ Print KOT
</button>

        </div>`;
    });
}

// ============================
// UPDATE STATUS
// ============================

async function updateStatus(id, status) {

    const { error } = await window.db
        .from("kot") // Change to "kots" if needed
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error(error);
        return;
    }

    loadOrders();
}

// ============================
// INITIAL LOAD
// ============================

loadOrders();

// Refresh every 2 seconds
setInterval(loadOrders, 2000);

// Refresh timers every minute
setInterval(loadOrders, 60000);

// ============================
// REALTIME
// ============================

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
// ============================
// PRINT KOT
// ============================

async function printKOT(id) {

    const { data, error } = await window.db
        .from("kot") // Change to "kots" if needed
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    let items = "";

    if (Array.isArray(data.items)) {
        data.items.forEach(item => {
            items += `
                <p>${item.name} × ${item.quantity}</p>
            `;
        });
    }

    const printWindow = window.open("", "", "width=400,height=700");

    printWindow.document.write(`
    <html>
    <head>
        <title>${data.kot_number}</title>
        <style>
            body{
                font-family:monospace;
                width:58mm;
                margin:auto;
                padding:10px;
            }
            h2,h3{
                text-align:center;
            }
            hr{
                border:none;
                border-top:1px dashed #000;
            }
        </style>
    </head>

    <body>

        <h2>CHAATARRA</h2>
        <h3>${data.kot_number}</h3>

        <hr>

        <p>Customer: ${data.customer_name}</p>
        <p>Table: ${data.table_number || "-"}</p>
        <p>Time: ${new Date(data.created_at).toLocaleString()}</p>

        <hr>

        ${items}

        <hr>

        <h3>Total: ₹${data.total}</h3>

    </body>
    </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
