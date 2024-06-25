import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Update the path as necessary

const Forane = () => {
  const [foranes, setForanes] = useState([]);
  const [selectedForane, setSelectedForane] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchForanes();
  }, []);

  const fetchForanes = async () => {
    try {
      const response = await axiosInstance.get("/forane");
      setForanes(response.data);
    } catch (error) {
      console.error("Error fetching foranes:", error);
    }
  };
  const fetchForaneDetails = async (foraneId) => {
    try {
      const response = await axiosInstance.get(`/forane/${foraneId}`);
      const foraneData = response.data;
      setFormData({
        name: foraneData.name,
        building: foraneData.building,
        phone: foraneData.phone,
        street: foraneData.street || "",
        city: foraneData.city,
        district: foraneData.district,
        state: foraneData.state,
        pincode: foraneData.pincode,
      });
      setSelectedForane(foraneData);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching parish details:", error);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/forane/${selectedForane._id}`, formData);
      } else {
        await axiosInstance.post("/forane/newforane", formData);
      }
      fetchForanes();
      resetForm();
    } catch (error) {
      console.error("Error saving forane:", error);
    }
  };

  const handleEdit = (forane) => {
    console.log(forane._id);
    fetchForaneDetails(forane._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this forane?")) {
      try {
        await axiosInstance.delete(`/forane/${id}`);
        fetchForanes();
      } catch (error) {
        console.error("Error deleting forane:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      building: "",
      phone: "",
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    });
    setSelectedForane(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Forane Management</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Forane" : "Add New Forane"}
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
            {isEditing ? "Update" : "Add"} Forane
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

      <h2 className="text-2xl font-bold mb-4">Forane List</h2>
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
            {foranes.map((forane) => (
              <tr key={forane._id}>
                <td className="py-2 px-4 border-b">{forane.name}</td>
                <td className="py-2 px-4 border-b">{forane.phone}</td>
                <td className="py-2 px-4 border-b">{forane.city}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    onClick={() => handleEdit(forane)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(forane._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Forane;
