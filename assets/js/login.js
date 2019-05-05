console.log("Login js is running");

window.addEventListener("load", checkSession);

const formLogin = document.querySelector("#form-login");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

formLogin.addEventListener("submit", e => {
  e.preventDefault();
  actionLogin();
});

function actionLogin() {
  const loginData = { email: email.value, password: password.value };

  $.ajax({
    type: "POST",
    url: "/api/login",
    contentType: "application/json",
    data: JSON.stringify(loginData),
    dataType: "json",
    success: function(data) {
      localStorage.setItem("myToken", JSON.stringify(data));
      window.location = "/home";
    }
  });
}

function checkSession() {
  if (localStorage.getItem("myToken")) {
    $.ajax({
      type: "GET",
      url: "/redirect",
      success: function(data) {
        window.location = "/home";
      }
    });
  }
}
