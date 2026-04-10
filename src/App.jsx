import { useState, useEffect } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  // 🔐 login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👤 user states
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ➕ add user states
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  // 🔄 fetch users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://node-backend-api-72zx.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      alert("Error fetching users ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 login
  const handleLogin = async () => {
    const res = await fetch(
      "https://node-backend-api-72zx.onrender.com/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      fetchUsers();
    } else {
      alert(data.message || "Login failed ❌");
    }
  };

  // 🚪 logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsers([]);
  };

  // ➕ add user
  const handleAddUser = async () => {
    console.log("🔥 ADD USER CLICKED");

    if (!name || !newEmail || !newPassword) {
      alert("⚠️ Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again ❌");
      return;
    }

    try {
      const res = await fetch(
        "https://node-backend-api-72zx.onrender.com/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email: newEmail,
            password: newPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.success) {
        alert("User added ✅");
        setName("");
        setNewEmail("");
        setNewPassword("");
        fetchUsers();
      } else {
        alert(data?.message || "Error ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  // ✏️ update user
  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://node-backend-api-72zx.onrender.com/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email: newEmail,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("User updated ✏️");
        setEditingUser(null);
        setName("");
        setNewEmail("");
        setNewPassword("");
        fetchUsers();
      } else {
        alert(data.message || "Update failed ❌");
      }
    } catch {
      alert("Update error ❌");
    }
  };

  // 🗑️ delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://node-backend-api-72zx.onrender.com/users/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("User deleted 🗑️");
      fetchUsers();
    } else {
      alert("Delete failed ❌");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setNewEmail(user.email);
  };

  // 🔄 auto login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      fetchUsers();
    }
  }, []);

  // 🔍 search + pagination
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center px-4">
      {!isLoggedIn ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Login 🔐</h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-bold">Dashboard 🚀</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="mb-6">
            <h3>Add User</h3>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={() =>
                editingUser ? handleUpdateUser() : handleAddUser()
              }
            >
              {editingUser ? "Update User" : "Add User"}
            </button>
          </div>

          {paginatedUsers.map((user) => (
            <div key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;