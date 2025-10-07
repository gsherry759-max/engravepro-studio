import React, { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    const res = await fetch("/.netlify/functions/users-list", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setUsers(await res.json());
    else alert(await res.text());
  }

  async function resetUser(email) {
    const token = localStorage.getItem("token");
    await fetch("/.netlify/functions/users-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });
    fetchUsers();
  }

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <table className="table">
        <thead><tr><th>Email</th><th>Trials</th><th></th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email}>
              <td>{u.email}</td>
              <td>{u.trialRemaining}</td>
              <td><button onClick={()=>resetUser(u.email)}>Reset</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}