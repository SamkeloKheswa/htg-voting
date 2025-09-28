async function loadDashboard() {
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
}

if (document.getElementById('contestants')) {
  loadDashboard();
}
