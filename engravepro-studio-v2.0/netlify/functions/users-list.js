import { verifyToken, readUsers } from "./utils.js";

export async function handler(event) {
  const token = event.headers.authorization?.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if (!decoded.isAdmin) throw new Error("Not admin");
    const users = readUsers().map((u) => ({
      email: u.email,
      trialRemaining: u.trialRemaining
    }));
    return { statusCode: 200, body: JSON.stringify(users) };
  } catch {
    return { statusCode: 403, body: "Forbidden" };
  }
}