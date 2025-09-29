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

    if (fs.existsSync(votesFile)) {
      votes = JSON.parse(fs.readFileSync(votesFile, "utf-8"));
    }

    messages.forEach(msg => {
      const voterMsg = msg.message.trim().toUpperCase(); // Example: TK259102

      // First 2 or 3 letters are contestant code, rest is reference
      const contestantCode = voterMsg.match(/^[A-Z]+/)[0];
      const reference = voterMsg.replace(contestantCode, "");

      if (!votes[contestantCode]) {
        votes[contestantCode] = 0;
      }
      votes[contestantCode]++;

      console.log(`✅ Vote received for ${contestantCode} (Ref: ${reference})`);
    });

    // Save updated votes.json
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };
  } catch (err) {
    console.error("❌ Error processing SMS:", err);
    return { statusCode: 500, body: "Webhook error" };
  }
}
