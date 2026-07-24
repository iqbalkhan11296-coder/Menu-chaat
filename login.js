document
.getElementById("login-form")
.addEventListener("submit",function(e){

e.preventDefault();

const password=document
.getElementById("password")
.value;

if(password==="chaatarra123"){

window.location.href="admin.html";

}else{

alert("Wrong Password");

}

});
