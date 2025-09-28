const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  try {
    const votesFile = path.join(__dirname, "..", "votes.json");
    const contestantsFile = path.join(__dirname, "..", "contestants.json");

    let { smsText, from } = JSON.parse(event.body);

    let votes = JSON.parse(fs.readFileSync(votesFile));
    let contestants = JSON.parse(fs.readFileSync(contestantsFile));

    if (smsText) {
      const voteIndex = votes.findIndex(v => v.code === smsText.trim());
      if (voteIndex === -1) return { statusCode: 400, body: "Invalid code" };
      votes[voteIndex].votes += 1;
      fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
      console.log(`Vote received from ${from || 'test'} for ${smsText}`);
    }

    // Combine votes with contestant info
    let results = contestants.map(c => {
      const v = votes.find(v => v.code === c.code);
      return { name: c.name, code: c.code, votes: v.votes };
    });

    // Sort by votes and assign rank
    results.sort((a,b) => b.votes - a.votes);
    results = results.map((r,i) => ({ ...r, rank: i+1 }));

    return { statusCode: 200, body: JSON.stringify({ results }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
