// functions/incomingSMS.js
import fs from "fs";
import path from "path";

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      body: "✅ Incoming SMS function is live. Use POST to send data."
    };
  }

  try {
    const data = JSON.parse(event.body);
    const messages = data.messages || [];

    const votesFile = path.join(process.cwd(), "votes.json");
    let votes = {};

    if (fs.existsSync(votesFile)) {
      votes = JSON.parse(fs.readFileSync(votesFile, "utf-8"));
    }

    messages.forEach(msg => {
      const voterMsg = msg.message.trim().toUpperCase(); // e.g., "TK259102"
      const match = voterMsg.match(/^[A-Z]+/);
      if (!match) return;

      const contestantCode = match[0];
      votes[contestantCode] = (votes[contestantCode] || 0) + 1;
      console.log(`✅ Vote received for ${contestantCode} from ${msg.msisdn}`);
    });

    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };

  } catch (err) {
    console.error("❌ Error processing SMS:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
}
