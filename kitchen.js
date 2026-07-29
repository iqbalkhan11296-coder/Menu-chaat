alert("Kitchen JS Connected");

let newOrderSound;
let ordersDiv;


// ============================
// START
// ============================

document.addEventListener("DOMContentLoaded", () => {

    newOrderSound = document.getElementById("newOrderSound");
    ordersDiv = document.getElementById("orders");

    loadOrders();

});


// ============================
// LOAD ORDERS
// ============================

async function loadOrders(){


    const { data, error } = await window.db
        .from("kot")
        .select("*")
        .order("created_at", { ascending:false });



    if(error){

        alert("KOT ERROR: " + error.message);
        return;

    }



    alert("Orders found: " + data.length);



    ordersDiv.innerHTML = "";



    data.forEach(order => {


        let itemsHTML = "";


        let items = order.items || order.Items;



        if(typeof items === "string"){

            try{

                items = JSON.parse(items);

            }catch{

                items = [];

            }

        }



        if(Array.isArray(items)){

            items.forEach(item=>{

                itemsHTML += `
                <p>
                ${item.name} × ${item.quantity}
                </p>
                `;

            });

        }



        ordersDiv.innerHTML += `

        <div class="order-card">

            <h2>${order.kot_number || "KOT"}</h2>

            <p>
            Customer: ${order.customer_name || "-"}
            </p>

            <p>
            Table: ${order.table_number || "-"}
            </p>

            <p>
            Items:
            </p>

            ${itemsHTML || "<p>No items</p>"}

            <p>
            Total: ₹${order.total || 0}
            </p>

            <p>
            Status: ${order.status || "Pending"}
            </p>

        </div>

        `;


    });


}



// ============================
// AUTO REFRESH
// ============================

setInterval(loadOrders,3000);


// ============================
// REALTIME
// ============================

window.db
.channel("kitchen-orders")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"kot"
},
()=>{
    loadOrders();
}
)
.subscribe();
