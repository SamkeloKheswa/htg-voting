// Dashboard functions
async function loadVotes() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  const res = await fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ smsText: "" }) // blank to fetch all
  });
  const data = await res.json();

  data.results.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    // Determine rank color
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

// Load votes on page load
document.addEventListener('DOMContentLoaded', loadVotes);
