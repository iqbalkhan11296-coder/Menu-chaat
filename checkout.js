// ============================
// LOAD CART
// ============================

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const summaryItems = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");

// ============================
// DISPLAY ORDER SUMMARY
// ============================

function loadOrder(){

    let total = 0;

    summaryItems.innerHTML = "";

    if(cart.length === 0){

        summaryItems.innerHTML = "<p>Your cart is empty.</p>";
        summaryTotal.innerText = "0";
        return;

    }

    cart.forEach(item=>{

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        summaryItems.innerHTML += `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${itemTotal}</span>
        </div>
        `;

    });

    summaryTotal.innerText = total;

}

loadOrder();


// ============================
// PLACE ORDER
// ============================

async function placeOrder(){

    const customer_name = document
        .getElementById("customerName")
        .value
        .trim();

    const phone = document
        .getElementById("phone")
        .value
        .trim();

    const table_number = document
        .getElementById("tableNumber")
        .value
        .trim();

    const notes = document
        .getElementById("notes")
        .value
        .trim();

    if(customer_name === "" || phone === ""){

        alert("Please enter your name and phone number.");
        return;

    }

    const items = JSON.parse(localStorage.getItem("cart")) || [];

    if(items.length === 0){

        alert("Your cart is empty.");
        return;

    }

    const total = items.reduce((sum,item)=>{

        return sum + (item.price * item.quantity);

    },0);

    try{

        const { error } = await window.db
            .from("orders")
            .insert([
                {
                    customer_name,
                    phone,
                    table_number,
                    notes,
                    items,
                    total,
                    status:"New"
                }
            ]);

        if(error){

            alert("Order Failed\n\n" + error.message);
            console.error(error);
            return;

        }

        localStorage.removeItem("cart");

        alert("🎉 Order placed successfully!");

        window.location.href = "success.html";

    }
    catch(err){

        console.error(err);
        alert("JavaScript Error\n\n" + err.message);

    }

}
