// Hardcoded admin users
const users = {
  "Themba K": "Password@1234",
  "Langa M": "Password@1234"
};

// Login system
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (users[username] && users[username] === password) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error").innerText = "Invalid credentials!";
    }
  });
}

// Show results in dashboard
if (document.getElementById("results")) {
  fetch("votes.json")
    .then(res => res.json())
    .then(data => {
      let html = "<ul>";
      for (const [contestant, votes] of Object.entries(data)) {
        html += `<li>${contestant}: ${votes} votes</li>`;
      }
      html += "</ul>";
      document.getElementById("results").innerHTML = html;
    });
}

// Logout
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}
