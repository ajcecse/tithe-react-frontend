import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const Koottayma = () => {
  const [koottaymas, setKoottaymas] = useState([]);
  const [foranes, setForanes] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [selectedKoottayma, setSelectedKoottayma] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    forane: "",
    parish: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedForane, setSelectedForane] = useState("");
  const [selectedParish, setSelectedParish] = useState("");

  useEffect(() => {
    fetchForanes();
  }, []);

  useEffect(() => {
    if (selectedForane) {
      fetchParishes(selectedForane);
    }
  }, [selectedForane]);

  useEffect(() => {
    if (selectedParish) {
      fetchKoottaymas(selectedParish);
    }
  }, [selectedParish]);

  const fetchForanes = async () => {
    try {
      const response = await axiosInstance.get("/forane");
      setForanes(response.data);
    } catch (error) {
      console.error("Error fetching foranes:", error);
    }
  };

  const fetchParishes = async (foraneId) => {
    try {
      const response = await axiosInstance.get(`/parish/forane/${foraneId}`);
      setParishes(response.data || []);
    } catch (error) {
      console.error("Error fetching parishes:", error);
    }
  };

  const fetchKoottaymas = async (parishId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/koottayma/${parishId}`);
      setKoottaymas(response.data || []);
    } catch (error) {
      console.error("Error fetching koottaymas:", error);
      setError("Failed to fetch koottaymas. Please try again.");
      setKoottaymas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKoottaymaDetails = async (koottaymaId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/koottayma/${koottaymaId}`);

      const koottaymaData = response.data;
      console.log(koottaymaData);
      setFormData({
        name: koottaymaData.name,
      });
      setSelectedKoottayma(koottaymaData);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching koottayma details:", error);
      setError("Failed to fetch koottayma details. Please try again.");
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
        await axiosInstance.put(`/koottayma/${formData._id}`, formData);
      } else {
        await axiosInstance.post("/koottayma/newkoottayma", {
          ...formData,
          forane: selectedForane,
          parish: selectedParish,
        });
      }
      fetchKoottaymas(selectedParish);
      resetForm();
    } catch (error) {
      console.error("Error saving koottayma:", error);
    }
  };

  const handleEdit = (koottayma) => {
    setFormData(koottayma);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this koottayma?")) {
      try {
        await axiosInstance.delete(`/koottayma/${id}`);
        fetchKoottaymas(selectedParish);
      } catch (error) {
        console.error("Error deleting koottayma:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      forane: "",
      parish: "",
    });
    setSelectedKoottayma(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Koottayma Management</h1>

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

      {selectedForane && (
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="parishSelect"
          >
            Select Parish
          </label>
          <select
            id="parishSelect"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedParish}
            onChange={(e) => setSelectedParish(e.target.value)}
          >
            <option value="">Select a Parish</option>
            {parishes.map((parish) => (
              <option key={parish._id} value={parish._id}>
                {parish.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Koottayma" : "Add New Koottayma"}
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
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? "Update Koottayma" : "Add Koottayma"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Koottayma List</h2>
      {isLoading ? (
        <p>Loading koottaymas...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="flex flex-row justify-between">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-10 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {koottaymas.length > 0 ? (
              koottaymas.map((koottayma) => (
                <tr
                  key={koottayma._id}
                  className="flex flex-row justify-between"
                >
                  <td className="py-2 px-3 border-b">{koottayma.name}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(koottayma)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(koottayma._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center">
                  No koottaymas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Koottayma;
