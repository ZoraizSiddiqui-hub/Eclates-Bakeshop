// src/admin/pages/Orders/Orders.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Orders.css";
import {
  fetchAllOrdersAPI,
  updateOrderStatusAPI,
} from "../../../../Frontend/src/api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Stable fetch function
  const fetchAllOrders = useCallback(async () => {
    try {
      const res = await fetchAllOrdersAPI();
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message || "Failed to fetch orders",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching orders",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update order status without causing loop
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatusAPI(orderId, newStatus);
      if (res.data.success) {
        MySwal.fire({
          icon: "success",
          title: "Order Updated",
          text: "The order status has been changed successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        // Update local state instead of refetching
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      } else {
        MySwal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.data.message || "Failed to update status",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating status",
      });
    }
  };

  // Apply filters
  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (search.trim() !== "") {
      filtered = filtered.filter((order) => {
        const orderIdMatch = order._id
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const nameMatch = order.userId?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return orderIdMatch || nameMatch;
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (dateFilter !== "") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt)
          .toISOString()
          .split("T")[0];
        return orderDate === dateFilter;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  if (loading) {
    return <div className="adminorder-loading">Loading orders...</div>;
  }

  return (
    <div className="adminorder-page">
      <h1>All Orders</h1>

      {/* Filters */}
      <div className="adminorder-filters">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="adminorder-search"
        />

        <select
          className="adminorder-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          className="adminorder-date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {currentOrders.length === 0 ? (
        <p className="adminorder-empty">No matching orders found.</p>
      ) : (
        <>
          <table className="adminorder-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.name || "Unknown"}</td>
                  <td>₨ {order.totalAmount}</td>
                  <td>
                    <span
                      className={`status-badge status-${(
                        order.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                  <td>
                    <select
                      className="adminorder-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="adminorder-details-btn"
                      onClick={() => navigate(`/admin/order/${order._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="adminorder-pagination">
            <button
              className="adminorder-page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            <span className="adminorder-page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="adminorder-page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
