import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);
    const messages = data.messages || [{ message: data.message, msisdn: data.msisdn }];
    
    // Path to votes.json
    const votesPath = path.join(process.cwd(), "votes.json");
    const votesData = JSON.parse(fs.readFileSync(votesPath));

    messages.forEach(msg => {
      const code = msg.message.trim().toUpperCase();
      if (votesData[code] !== undefined) {
        votesData[code] += 1;
      }
    });

    fs.writeFileSync(votesPath, JSON.stringify(votesData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", message: "Votes recorded" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
}
