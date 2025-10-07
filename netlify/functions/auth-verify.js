import { verifyToken } from "./utils.js";

export async function handler(event) {
  const token = event.headers.authorization?.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    return { statusCode: 200, body: JSON.stringify(decoded) };
  } catch {
    return { statusCode: 401, body: "Invalid token" };
  }
}