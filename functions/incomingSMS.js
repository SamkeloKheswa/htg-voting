// functions/incomingSMS.js
import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    const data = JSON.parse(event.body);
    const messages = data.messages || [];

    // Path to votes.json
    const votesFile = path.join(process.cwd(), "votes.json");
    let votes = {};

    // Load existing votes if file exists
    if (fs.existsSync(votesFile)) {
      votes = JSON.parse(fs.readFileSync(votesFile, "utf-8"));
    }

    // Process each incoming SMS
    messages.forEach(msg => {
      const voterMsg = msg.message.trim().toUpperCase(); // Example: "TK259102"

      // Extract contestant code (letters at the start)
      const match = voterMsg.match(/^[A-Z]+/);
      if (!match) return; // Ignore invalid messages

      const contestantCode = match[0];

      // Increment vote count
      if (!votes[contestantCode]) {
        votes[contestantCode] = 0;
      }
      votes[contestantCode]++;

      console.log(`✅ Vote received for ${contestantCode} from ${msg.msisdn}`);
    });

    // Save updated votes.json
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    // Return success
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };

  } catch (err) {
    console.error("❌ Error processing SMS:", err);
    return {
      statusCode: 500,
      body: "Webhook error"
    };
  }
}
