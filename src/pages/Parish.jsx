import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const Parish = () => {
  const [parishes, setParishes] = useState([]);
  const [foranes, setForanes] = useState([]);
  const [selectedParish, setSelectedParish] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    forane: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedForane, setSelectedForane] = useState("");

  useEffect(() => {
    fetchForanes();
  }, []);

  useEffect(() => {
    if (selectedForane) {
      fetchParishes(selectedForane);
    }
  }, [selectedForane]);

  const fetchForanes = async () => {
    try {
      const response = await axiosInstance.get("/forane");
      setForanes(response.data);
    } catch (error) {
      console.error("Error fetching foranes:", error);
    }
  };

  const fetchParishes = async (foraneId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`parish/forane/${foraneId}`);
      setParishes(response.data || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching parishes:", error);
      setError("Failed to fetch parishes. Please try again.");
      setParishes([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParishDetails = async (parishId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/parish/${parishId}`);
      const parishData = response.data;
      setFormData({
        name: parishData.name,
        building: parishData.building,
        forane: parishData.forane._id,
        phone: parishData.phone,
        street: parishData.street || "",
        city: parishData.city,
        district: parishData.district,
        state: parishData.state,
        pincode: parishData.pincode,
      });
      setSelectedParish(parishData);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching parish details:", error);
      setError("Failed to fetch parish details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/parish/${selectedParish._id}`, formData);
      } else {
        await axiosInstance.post("/parish/newparish", {
          ...formData,
          forane: selectedForane,
        });
      }
      fetchParishes(selectedForane);
      resetForm();
    } catch (error) {
      console.error("Error saving parish:", error);
    }
  };

  const handleEdit = (parish) => {
    fetchParishDetails(parish._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this parish?")) {
      try {
        await axiosInstance.delete(`/parish/${id}`);
        fetchParishes(selectedForane);
      } catch (error) {
        console.error("Error deleting parish:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      building: "",
      forane: "",
      phone: "",
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    });
    setSelectedParish(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Parish Management</h1>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="foraneSelect"
        >
          Select Forane
        </label>
        <select
          id="foraneSelect"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedForane}
          onChange={(e) => setSelectedForane(e.target.value)}
        >
          <option value="">Select a Forane</option>
          {foranes.map((forane) => (
            <option key={forane._id} value={forane._id}>
              {forane.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Parish" : "Add New Parish"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="building"
            >
              Building
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="building"
              type="text"
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="street"
            >
              Street
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="street"
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="city"
            >
              City
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="district"
            >
              District
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="state"
            >
              State
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="pincode"
            >
              Pincode
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            type="submit"
          >
            {isEditing ? "Update" : "Add"} Parish
          </button>
          {isEditing && (
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Parish List</h2>
      {isLoading ? (
        <p>Loading parishes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : parishes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">City</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parishes.map((parish) => (
                <tr key={parish._id}>
                  <td className="py-2 px-4 border-b">{parish.name}</td>
                  <td className="py-2 px-4 border-b">{parish.phone}</td>
                  <td className="py-2 px-4 border-b">{parish.city}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(parish)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(parish._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No parishes found for this forane.</p>
      )}
    </div>
  );
};

export default Parish;
