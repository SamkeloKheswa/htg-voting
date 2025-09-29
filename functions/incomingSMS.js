import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    const data = event.body ? JSON.parse(event.body) : {};

    // Support BulkSMS format
    const messages = data.messages || [{ message: data.message, msisdn: data.msisdn }];

    // Path to votes.json
    const votesFile = path.join(process.cwd(), "votes.json");

    // Read current votes
    let votes = fs.existsSync(votesFile)
      ? JSON.parse(fs.readFileSync(votesFile, "utf-8"))
      : {};

    // Increment votes
    messages.forEach(msg => {
      if (!msg.message) return;
      const code = msg.message.trim().toUpperCase();
      votes[code] = (votes[code] || 0) + 1;
      console.log(`Vote received for ${code} from ${msg.msisdn || "unknown"}`);
    });

    // Save updated votes
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };
  } catch (err) {
    console.error("Error processing SMS:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
}
