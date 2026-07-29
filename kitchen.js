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

    console.log("KOT DATA:", data);



    if(!ordersDiv) return;



    ordersDiv.innerHTML = "";



    data.forEach(order => {


        let itemsHTML = "";


        let items = order.items || order.Items;



        if(typeof items === "string"){

            try{

                items = JSON.parse(items);

            }
            catch{

                items = [];

            }

        }



        if(Array.isArray(items)){


            items.forEach(item=>{

                itemsHTML += `

                <p>
                ${item.name || "-"} × ${item.quantity || 1}
                </p>

                `;

            });


        }



        ordersDiv.innerHTML += `


        <div class="order-card">


            <h2>
            ${order.kot_number || "KOT"}
            </h2>


            <p>
            <strong>Customer:</strong>
            ${order.customer_name || "-"}
            </p>


            <p>
            <strong>Table:</strong>
            ${order.table_number || "-"}
            </p>


            <p>
            <strong>Time:</strong>
            ${order.created_at ? new Date(order.created_at).toLocaleTimeString() : "-"}
            </p>



            <hr>


            <strong>Items</strong>

            ${itemsHTML || "<p>No items</p>"}



            <p>
            <strong>Total:</strong>
            ₹${order.total || 0}
            </p>


            <p>
            <strong>Status:</strong>
            ${order.status || "Pending"}
            </p>



            <button onclick="updateStatus(${order.id},'Preparing')">
            Preparing
            </button>


            <button onclick="updateStatus(${order.id},'Ready')">
            Ready
            </button>


            <button onclick="updateStatus(${order.id},'Completed')">
            Completed
            </button>



        </div>


        `;


    });



}



// ============================
// UPDATE STATUS
// ============================

async function updateStatus(id,status){


    const { error } = await window.db
        .from("kot")
        .update({status:status})
        .eq("id",id);



    if(error){

        alert(error.message);
        return;

    }


    loadOrders();

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
