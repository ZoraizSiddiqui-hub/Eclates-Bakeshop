// src/admin/pages/Users/Users.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Users.css";
import {
  fetchAllUsersAPI,
  promoteUserToAdminAPI,
} from "../../api/api";  // centralized APIs
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Stable fetch function
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetchAllUsersAPI();
      if (res.data.success) {
        setUsers(res.data.users || []);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message || "Failed to fetch users",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Server error while fetching users",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Promote user to admin without redundant fetch
  const promoteToAdmin = async (email) => {
    try {
      const res = await promoteUserToAdminAPI(email);
      if (res.data.success) {
        MySwal.fire({
          icon: "success",
          title: "User Promoted",
          text: res.data.message || "User promoted to admin successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        // Update local state directly
        setUsers((prev) =>
          prev.map((u) =>
            u.email === email ? { ...u, isAdmin: true } : u
          )
        );
      } else {
        MySwal.fire({
          icon: "error",
          title: "Promotion Failed",
          text: res.data.message || "Failed to promote user",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Server error while promoting user",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading users...</p>;

  // ✅ Apply search filter
  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="users-page">
      <h1>Users Management</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="users-search"
      />

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Promote</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4">No matching users found.</td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`role-badge ${
                      u.isAdmin ? "role-admin" : "role-user"
                    }`}
                  >
                    {u.isAdmin ? "Admin" : "User"}
                  </span>
                </td>
                <td>
                  {!u.isAdmin && (
                    <button onClick={() => promoteToAdmin(u.email)}>
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
