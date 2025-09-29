import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    // Parse incoming JSON
    const data = event.body ? JSON.parse(event.body) : {};

    // BulkSMS sends 'messages' array, but fallback to the whole body if missing
    const messages = data.messages || [{ message: data.message, msisdn: data.msisdn }];

    // Load votes.json
    const votesFile = path.join(process.cwd(), "votes.json");
    let votes = fs.existsSync(votesFile)
      ? JSON.parse(fs.readFileSync(votesFile, "utf-8"))
      : {};

    // Increment votes for each message
    messages.forEach(msg => {
      if (!msg.message) return;
      const code = msg.message.trim().toUpperCase();
      votes[code] = (votes[code] || 0) + 1;
      console.log(`Vote received for ${code} from ${msg.msisdn || "unknown number"}`);
    });

    // Save votes
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    // Always return 200 OK
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };

  } catch (err) {
    console.error("Error processing SMS:", err);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "Webhook live" })
    };
  }
}
