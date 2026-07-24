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

data.forEach(order => {

html += `
<div>

<h3>Order #${order.id}</h3>

<p>Name: ${order.customer_name}</p>
<p>Table: ${order.table_number}</p>

<h4>Items:</h4>
`;

order.items.forEach(item => {

html += `
<p>
${item.name} × ${item.quantity} 
= ₹${item.price * item.quantity}
</p>
`;

});


html += `
<p><b>Total: ₹${order.total}</b></p>

<hr>
</div>
`;

});
