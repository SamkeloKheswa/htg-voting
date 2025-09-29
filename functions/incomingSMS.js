import fs from "fs";
import path from "path";

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      body: "✅ IncomingSMS function is live. Send POST requests to submit votes."
    };
  }

  try {
    const data = JSON.parse(event.body);
    const messages = data.messages || [];

    const votesFile = path.join(process.cwd(), "votes.json");
    let votes = fs.existsSync(votesFile)
      ? JSON.parse(fs.readFileSync(votesFile, "utf-8"))
      : {};

    messages.forEach(msg => {
      const code = msg.message.trim().toUpperCase(); // e.g., "TK259101"
      votes[code] = (votes[code] || 0) + 1;
      console.log(`Vote received for ${code} from ${msg.msisdn}`);
    });

    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", votes })
    };
  } catch (err) {
    console.error("Error processing SMS:", err);
    return { statusCode: 500, body: JSON.stringify({ status: "error", message: err.message }) };
  }
}
