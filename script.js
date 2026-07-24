let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Add item
function addToCart(name, price) {

    let item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    saveCart();
}

// Save cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Render cart
function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach((item, index) => {

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

// Increase quantity
function increaseQty(index) {
    cart[index].quantity++;
    saveCart();
}

// Decrease quantity
function decreaseQty(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index,1);
    }

    saveCart();
}

// Open cart
cartBtn.onclick = function() {
    cartPanel.classList.add("active");
}

// Close cart
closeCart.onclick = function() {
    cartPanel.classList.remove("active");
}

// Checkout
document.getElementById("checkout-btn").onclick = function(){
    window.location.href = "checkout.html";
};

renderCart();
// Search Menu

function searchMenu(){

    let input = document
        .getElementById("search")
        .value
        .toLowerCase();

    let cards = document
        .querySelectorAll(".card");

    cards.forEach(card=>{

        let name = card
            .querySelector("h2")
            .innerText
            .toLowerCase();

        if(name.includes(input))
            card.style.display="block";
        else
            card.style.display="none";

    });

}
function filterMenu(category){

const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

if(category==="all"){

card.style.display="block";

}else if(card.classList.contains(category)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}
