import { readUsers, writeUsers, hashPassword, signToken } from "./utils.js";

export async function handler(event) {
  const { email, password } = JSON.parse(event.body);
  const users = readUsers();
  if (users.find((u) => u.email === email))
    return { statusCode: 400, body: "User already exists" };

  const pwHash = await hashPassword(password);
  const newUser = {
    email,
    password: pwHash,
    trialRemaining: 2,
    isAdmin: false
  };
  users.push(newUser);
  writeUsers(users);
  const token = signToken(newUser);
  return { statusCode: 200, body: JSON.stringify({ token }) };
}