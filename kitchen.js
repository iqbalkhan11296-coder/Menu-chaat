let newOrderSound;
let ordersDiv;
let lastOrderCount = 0;


// ============================
// START
// ============================

document.addEventListener("DOMContentLoaded", () => {

    newOrderSound = document.getElementById("newOrderSound");
    ordersDiv = document.getElementById("orders");

    loadOrders();

});


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
        color:white;
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
        .from("kot")
        .select("*")
        .order("created_at", { ascending:false });


    if(error){

        console.log("KOT ERROR:", error);
        return;

    }


    console.log("KOT DATA:", data);


    if(!ordersDiv) return;


    ordersDiv.innerHTML = "";


    data.forEach(order => {


        let itemsHTML = "";

        // FIXED: Supabase column is "Items"
        let items = order.Items;


        if(typeof items === "string"){

            try{

                items = JSON.parse(items);

            }
            catch{

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


        ${getOrderTimer(order.created_at)}



        <div class="items">

        ${itemsHTML}

        </div>



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


    const {error}=await window.db
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

setInterval(loadOrders,2000);

setInterval(loadOrders,60000);



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


const {data,error}=await window.db
.from("kot")
.select("*")
.eq("id",id)
.single();



if(error){

alert(error.message);
return;

}



let items="";


// FIXED: Supabase column is "Items"
let orderItems=data.Items;



if(typeof orderItems==="string"){

try{

orderItems=JSON.parse(orderItems);

}
catch{

orderItems=[];

}

}



if(Array.isArray(orderItems)){


orderItems.forEach(item=>{

items += `
<p>
${item.name} × ${item.quantity}
</p>
`;

});


}



const printWindow=window.open(
"",
"",
"width=400,height=700"
);



printWindow.document.write(`

<html>

<body style="font-family:monospace">

<h2 style="text-align:center">
CHAATARRA
</h2>


<h3 style="text-align:center">
${data.kot_number}
</h3>


<hr>


<p>
Customer: ${data.customer_name}
</p>


<p>
Table: ${data.table_number || "-"}
</p>


<hr>


${items}


<hr>


<h3>
Total: ₹${data.total}
</h3>


</body>

</html>

`);


printWindow.document.close();

printWindow.print();


}
