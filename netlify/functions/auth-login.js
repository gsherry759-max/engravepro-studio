import { readUsers, verifyPassword, signToken } from "./utils.js";

export async function handler(event) {
  const { email, password } = JSON.parse(event.body);
  const user = readUsers().find((u) => u.email === email);
  if (!user) return { statusCode: 404, body: "User not found" };

  const ok = await verifyPassword(password, user.password);
  if (!ok) return { statusCode: 403, body: "Invalid password" };

  const token = signToken(user);
  return { statusCode: 200, body: JSON.stringify({ token }) };
}