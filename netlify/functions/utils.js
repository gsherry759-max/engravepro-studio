import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Correct: resolves to the data folder INSIDE your function directory
const DATA_PATH = path.join(__dirname, "data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

export const readUsers = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
export const writeUsers = (data) =>
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

export const hashPassword = async (pw) => bcrypt.hash(pw, 10);
export const verifyPassword = async (pw, hash) => bcrypt.compare(pw, hash);

export const signToken = (user) =>
  jwt.sign(
    { email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);