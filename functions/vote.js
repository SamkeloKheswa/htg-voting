const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const votesPath = path.resolve(__dirname, '../votes.json');
  
  if(event.httpMethod === 'GET'){
    let votes = [];
    if(fs.existsSync(votesPath)){
      votes = JSON.parse(fs.readFileSync(votesPath));
    }
    return { statusCode: 200, body: JSON.stringify(votes) };
  }

  if(event.httpMethod === 'POST'){
    const body = JSON.parse(event.body);
    const { phone_number, network, vote_for, transaction_id, status, timestamp } = body;

    if(status !== 'success'){
      return { statusCode: 400, body: JSON.stringify({ message: 'Vote failed or pending' }) };
    }

    const vote = { phone_number, network, vote_for, transaction_id, timestamp };

    let votes = [];
    if(fs.existsSync(votesPath)){
      votes = JSON.parse(fs.readFileSync(votesPath));
    }
    votes.push(vote);
    fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));

    return { statusCode: 200, body: JSON.stringify({ status: 'received', message: 'Vote recorded successfully' }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
