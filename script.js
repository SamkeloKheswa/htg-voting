// Login Function
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

// Dashboard Functions
async function loadVotes() {
  const container = document.getElementById('cards-container');
  if (!container) return;

  const res = await fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ smsText: "" }) // blank to fetch all
  });
  const data = await res.json();

  container.innerHTML = '';
  data.results.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    let rankClass = '';
    if (p.rank === 1) rankClass = 'gold';
    else if (p.rank === 2) rankClass = 'silver';
    else if (p.rank === 3) rankClass = 'bronze';

    card.innerHTML = `
      <h2>${p.name}</h2>
      <p>Code: ${p.code}</p>
      <p>Votes: ${p.votes}</p>
      <span class="rank ${rankClass}">Rank: ${p.rank}</span>
      <br>
      <button onclick="vote('${p.code}')">Add Vote</button>
    `;
    container.appendChild(card);
  });
}

async function vote(code) {
  await fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ smsText: code, from: 'test' })
  });
  loadVotes();
}

// Auto-load votes on page load
document.addEventListener('DOMContentLoaded', loadVotes);
