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

async function loadOrders() {


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

        let items = order.Items;



        if(typeof items === "string"){

            try{

                items = JSON.parse(items);

            }catch{

                items = [];

            }

        }



        if(Array.isArray(items)){

            items.forEach(item => {

                itemsHTML += `
                <div>
                ${item.name} × ${item.quantity}
                </div>
                `;

            });

        }



        ordersDiv.innerHTML += `

        <div class="order-card">

        <h2>
        ${order.kot_number}
        </h2>


        <p>
        Customer: ${order.customer_name}
        </p>


        <p>
        Table: ${order.table_number || "-"}
        </p>


        <div>
        ${itemsHTML}
        </div>


        <p>
        Total: ₹${order.total}
        </p>


        <p>
        Status: ${order.status}
        </p>


        </div>

        `;


    });


}


// Auto refresh

setInterval(loadOrders,2000);



// Realtime

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
