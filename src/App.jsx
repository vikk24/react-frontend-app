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
  // edit
  const [editingUser, setEditingUser] = useState(null);

  // 🔄 fetch users
const fetchUsers = () => {
  const token = localStorage.getItem("token");

  setLoading(true);

  fetch("https://node-backend-api-72zx.onrender.com/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setUsers(data.data || []);
    })
    .catch(() => {
      alert("Error fetching users ❌");
    })
    .finally(() => {
      setLoading(false);
    });
};

  // 🔐 login
  const handleLogin = async () => {
    const res = await fetch("https://node-backend-api-72zx.onrender.com/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

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

  // 🔥 FRONTEND VALIDATION
  if (!name || !newEmail || !newPassword) {
    alert("⚠️ Please fill all fields");
    return; // stop API call
  }

  const token = localStorage.getItem("token");

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

  if (data.success) {
    alert("User added ✅");
    setName("");
    setNewEmail("");
    setNewPassword("");
    fetchUsers();
  } else {
    console.log("API RESPONSE:", data); // debug
    alert(data.message || "Error ❌");
  }

  } catch (error) {
    console.error(error);
    alert("Something went wrong ❌");
  }
};
const filteredUsers = users.filter((user) =>
  user.email.toLowerCase().includes(search.toLowerCase())
);

const paginatedUsers = filteredUsers.slice(
  (page - 1) * limit,
  page * limit
);
    // 🔄 auto login
    useEffect(() => {
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
        fetchUsers();
      }
    }, []);
    useEffect(() => {
      const totalPages = Math.ceil(filteredUsers.length / limit);

      if (page > totalPages) {
        setPage(totalPages || 1);
      }
    }, [filteredUsers]);
   
    useEffect(() => {
      setPage(1);
    }, [search]);
// console.log("Total users:", users.length);
// console.log("Filtered users:", filteredUsers.length);
// console.log("Current page:", page);

    const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://node-backend-api-72zx.onrender.com/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

    const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://node-backend-api-72zx.onrender.com/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email: newEmail,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("User updated ✏️");
      setEditingUser(null);
      setName("");
      setNewEmail("");
      fetchUsers();
    } else {
      alert("Update failed ❌");
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center px-4">
      {!isLoggedIn ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">
            Login 🔐
          </h1>

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
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Dashboard 🚀</h1>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          {/* ➕ Add User */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Add User</h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
        <button
          onClick={editingUser ? handleUpdateUser : handleAddUser}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editingUser ? "Update User" : "Add User"}
        </button>
          </div>

          {/* 👥 Users List */}
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <input
            type="text"
            placeholder="Search by email..."
            className="w-full p-2 border rounded mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
<div className="grid gap-3">
  {loading ? (
    <p className="text-center">Loading...</p>
  ) : (
    paginatedUsers.map((user) => (
      <div
        key={user.id}
        className="p-4 border rounded-xl flex justify-between items-center"
      >
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="bg-yellow-400 px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(user.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>
<div className="flex justify-center gap-4 mt-4">
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="font-medium">Page {page}</span>

  <button
    onClick={() => setPage(page + 1)}
    disabled={page >= Math.ceil(filteredUsers.length / limit)}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
        </div>
      )}
    </div>
  );
}

export default App;