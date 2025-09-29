// ======================== Login System ========================
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = {
    "ThembaK": "Nozulu@123",
    "MxolisiL": "Langa@123"
  };

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "❌ Invalid username or password";
  }
}

function checkAuth() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ======================== Dashboard Vote Loader ========================
async function loadDashboard() {
  try {
    const contestantsRes = await fetch('contestants.json');
    const votesRes = await fetch('votes.json');

    const contestants = await contestantsRes.json();
    const votes = await votesRes.json();

    // Sort contestants by votes descending
    contestants.sort((a, b) => (votes[b.code] || 0) - (votes[a.code] || 0));

    const tbody = document.querySelector("#voteTable tbody");
    tbody.innerHTML = '';

    contestants.forEach((c, index) => {
      const count = votes[c.code] || 0;
      let voteClass = count >= 10 ? "high" : count >= 5 ? "mid" : "low";

      // Position badge classes
      let posClass = index === 0 ? 'position-1' :
                     index === 1 ? 'position-2' :
                     index === 2 ? 'position-3' : 'position-others';

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="position ${posClass}">${index + 1}</span></td>
        <td>${c.name}</td>
        <td>${c.code}</td>
        <td class="votes ${voteClass}">${count}</td>
      `;
      tbody.appendChild(row);
    });

    // Update live timestamp
    const timestampEl = document.getElementById("lastUpdated");
    if (timestampEl) {
      const now = new Date();
      timestampEl.innerText = `Last Updated: ${now.toLocaleString()}`;
    }

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

// ======================== Auto-refresh every 2 minutes ========================
setInterval(() => {
  if (window.location.pathname.includes("dashboard.html")) {
    loadDashboard();
  }
}, 120000); // 120000 ms = 2 minutes

// ======================== Initial Load ========================
if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}
