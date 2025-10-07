import { verifyToken, readUsers, writeUsers } from "./utils.js";

export async function handler(event) {
  const token = event.headers.authorization?.split(" ")[1];
  const { email } = JSON.parse(event.body);
  try {
    const decoded = verifyToken(token);
    if (!decoded.isAdmin) throw new Error("Not admin");
    const users = readUsers().map((u) =>
      u.email === email ? { ...u, trialRemaining: 2 } : u
    );
    writeUsers(users);
    return { statusCode: 200, body: "Reset success" };
  } catch {
    return { statusCode: 403, body: "Forbidden" };
  }
}