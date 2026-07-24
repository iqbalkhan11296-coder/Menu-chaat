document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const password = document
            .getElementById("password")
            .value;

        if (password === "chaatarra123") {

            // Save login session
            localStorage.setItem("adminLoggedIn", "true");

            // Open admin page
            window.location.href = "admin.html";

        } else {

            alert("Wrong Password");

        }

    });
