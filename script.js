// Login system
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

// Dashboard vote loader
async function loadDashboard() {
  try {
    const contestantsRes = await fetch('contestants.json');
    const votesRes = await fetch('votes.json');

    const contestants = await contestantsRes.json();
    const votes = await votesRes.json();

    const container = document.getElementById('contestants');
    container.innerHTML = '';

    contestants.forEach(c => {
      const count = votes[c.code] || 0;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${c.name}</h3>
        <p>Unique Code: <strong>${c.code}</strong></p>
        <p class="vote-count">Votes: ${count}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}
