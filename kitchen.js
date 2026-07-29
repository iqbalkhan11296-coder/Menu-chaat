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

        console.log("KOT ERROR:", error.message);
        return;

    }



    console.log("Orders:", data);



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
                ${item.name || "-"} × ${item.quantity || 1}
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

            <hr>

            ${itemsHTML || "No items"}

            <hr>

            <p>
            Total: ₹${order.total || 0}
            </p>

            <p>
            Status: ${order.status || "Pending"}
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


            <button onclick="printKOT(${order.id})">
            🖨️ Print KOT
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
        .update({status})
        .eq("id",id);


    if(error){

        console.log(error);
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



// ============================
// PRINT KOT
// ============================

async function printKOT(id){


    const { data, error } = await window.db
        .from("kot")
        .select("*")
        .eq("id", id)
        .single();



    if(error){

        console.log(error);
        return;

    }



    let itemsHTML = "";

    let items = data.items || data.Items;



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
            ${item.name || "-"} × ${item.quantity || 1}
            </p>

            `;

        });

    }



    const printWindow = window.open(
        "",
        "",
        "width=400,height=700"
    );



    printWindow.document.write(`

    <html>

    <body style="
    font-family:monospace;
    width:58mm;
    padding:10px;
    ">


    <h2 style="text-align:center">
    CHAATARRA
    </h2>


    <h3 style="text-align:center">
    ${data.kot_number}
    </h3>


    <hr>


    <p>
    Customer: ${data.customer_name || "-"}
    </p>


    <p>
    Table: ${data.table_number || "-"}
    </p>


    <hr>


    ${itemsHTML || "No items"}


    <hr>


    <h3>
    Total: ₹${data.total || 0}
    </h3>


    </body>

    </html>

    `);



    printWindow.document.close();

    printWindow.print();


}
