const ordersDiv = document.getElementById("orders");

const order = JSON.parse(localStorage.getItem("lastOrder"));

if(!order){

ordersDiv.innerHTML="<p>No Orders Yet.</p>";

}else{

let html=`

<div class="order">

<h3>${order.customer}</h3>

<p><strong>Phone:</strong> ${order.phone}</p>

<p><strong>Table:</strong> ${order.table}</p>

<p><strong>Time:</strong> ${order.time}</p>

<ul>

`;

order.items.forEach(item=>{

html+=`<li>${item.name} × ${item.quantity}</li>`;

});

html+=`

</ul>

<h2>Total ₹${order.total}</h2>

<div class="status">

Preparing

</div>

</div>

`;

ordersDiv.innerHTML=html;

}
