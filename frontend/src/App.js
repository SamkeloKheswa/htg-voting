import { useEffect, useState } from 'react';

function App() {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/.netlify/functions/vote');
        const data = await response.json();
        setVotes(data);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Hammarsdale Got Talent Show 2025 - Live Votes</h1>
      <ul>
        {votes.map((v, i) => (
          <li key={i}>
            {v.vote_for} ({v.phone_number}) - {v.network} at {v.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
