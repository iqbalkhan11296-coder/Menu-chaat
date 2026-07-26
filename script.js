let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// --------------------
// Add Item
// --------------------
function addToCart(name, price){

    let item = cart.find(i => i.name === name);

    if(item){
        item.quantity++;
    }else{
        cart.push({
            name:name,
            price:price,
            quantity:1
        });
    }

    saveCart();
}

// --------------------
// Save Cart
// --------------------
function saveCart(){

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();

}

// --------------------
// Render Cart
// --------------------
function renderCart(){

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if(cart.length===0){
        cartItems.innerHTML="<p>Your cart is empty.</p>";
    }

    cart.forEach((item,index)=>{

        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item">

            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>

            <div>
                <button onclick="decreaseQty(${index})">−</button>

                <strong>${item.quantity}</strong>

                <button onclick="increaseQty(${index})">+</button>
            </div>

        </div>
        `;

    });

    cartCount.innerText = count;
    cartTotal.innerText = total;

}

// --------------------
// Increase Qty
// --------------------
function increaseQty(index){

    cart[index].quantity++;
    saveCart();

}

// --------------------
// Decrease Qty
// --------------------
function decreaseQty(index){

    cart[index].quantity--;

    if(cart[index].quantity<=0){
        cart.splice(index,1);
    }

    saveCart();

}

// --------------------
// Open Cart
// --------------------
cartBtn.addEventListener("click",function(){

    cartPanel.classList.add("active");

});

// --------------------
// Close Cart
// --------------------
closeCart.addEventListener("click",function(){

    cartPanel.classList.remove("active");

});

// --------------------
// Checkout
// --------------------
document.getElementById("checkout-btn").addEventListener("click",function(){

    window.location.href="checkout.html";

});

// --------------------
// Search Menu
// --------------------
function searchMenu(){

    let input=document
        .getElementById("search")
        .value
        .toLowerCase();

    let cards=document.querySelectorAll(".card");

    cards.forEach(card=>{

        let name=card
            .querySelector("h3")
            .innerText
            .toLowerCase();

        if(name.includes(input)){
            card.style.display="flex";
        }else{
            card.style.display="none";
        }

    });

}

// --------------------
// Filter Menu
// --------------------
function filterMenu(category){

    const cards=document.querySelectorAll(".card");

    document.querySelectorAll(".categories button").forEach(btn=>{
        btn.classList.remove("active");
    });

    if(event && event.target){
        event.target.classList.add("active");
    }

    cards.forEach(card=>{

        if(category==="all"){
            card.style.display="flex";
        }
        else if(card.classList.contains(category)){
            card.style.display="flex";
        }
        else{
            card.style.display="none";
        }

    });

}

// --------------------
// Initial Load
// --------------------
renderCart();
