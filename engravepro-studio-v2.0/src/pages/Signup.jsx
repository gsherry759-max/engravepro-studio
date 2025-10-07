import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const res = await fetch("/.netlify/functions/auth-signup", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/app";
    } else {
      alert(await res.text());
    }
  }

  return (
    <div className="container">
      <h2>Create Account</h2>
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <p><a href="/">Back to Login</a></p>
    </div>
  );
}