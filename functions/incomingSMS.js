import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    // BulkSMS test requests might not have 'messages'
    const data = JSON.parse(event.body || '{}');
    const messages = data.messages || [];

    const votesFile = path.join(process.cwd(), "votes.json");
    let votes = fs.existsSync(votesFile)
      ? JSON.parse(fs.readFileSync(votesFile, "utf-8"))
      : {};

    messages.forEach(msg => {
      const code = msg.message.trim().toUpperCase();
      votes[code] = (votes[code] || 0) + 1;
      console.log(`Vote received for ${code} from ${msg.msisdn}`);
    });

    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    // Always return 200 OK to BulkSMS
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };
  } catch (err) {
    console.error("Error processing SMS:", err);
    return { statusCode: 200, body: JSON.stringify({ status: "ok", message: "Webhook live" }) };
  }
}
