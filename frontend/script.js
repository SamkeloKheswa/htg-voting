// Login simulation
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const error = document.getElementById('error');

  if ((username === 'ThembaK' && password === 'Nozulu@123') ||
      (username === 'MxolisiL' && password === 'Langa@123')) {
    window.location.href = 'dashboard.html';
  } else {
    error.textContent = 'Invalid username or password';
  }
}

// Dashboard functions
async function loadVotes() {
  const tbody = document.querySelector('#leaderboard tbody');
  tbody.innerHTML = '';

  const res = await fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ smsText: "" }) // blank to fetch current votes
  });
  const data = await res.json();

  data.results.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.rank}</td>
      <td>${p.name}</td>
      <td>${p.code}</td>
      <td>${p.votes}</td>
      <td><button onclick="vote('${p.code}')">Add Vote</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function vote(code) {
  await fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ smsText: code, from: 'test' })
  });
  loadVotes();
}

// Load votes on page load
if (document.querySelector('#leaderboard')) loadVotes();
