// functions/registerWebhook.js
import fetch from "node-fetch";

export async function handler(event) {
  const API_TOKEN = process.env.BULKSMS_API_TOKEN;

  const webhookData = {
    name: "HGT Voting Incoming",
    url: "https://htg-voting.netlify.app/.netlify/functions/incomingSMS",
    triggers: ["message_received"],
    invoke_with: "many_messages"
  };

  const response = await fetch("https://api.bulksms.com/v1/webhooks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify(webhookData)
  });

  const data = await response.json();

  return {
    statusCode: response.status,
    body: JSON.stringify(data)
  };
}
