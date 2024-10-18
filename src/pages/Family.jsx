import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const Family = () => {
  const [families, setFamilies] = useState([]);
  const [foranes, setForanes] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [koottaymas, setKoottaymas] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    building: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedForane, setSelectedForane] = useState("");
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedKoottayma, setSelectedKoottayma] = useState("");

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

  useEffect(() => {
    if (selectedKoottayma) {
      fetchFamilies(selectedKoottayma);
    }
  }, [selectedKoottayma]);

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
    try {
      const response = await axiosInstance.get(`/koottayma/parish/${parishId}`);
      setKoottaymas(response.data || []);
    } catch (error) {
      console.error("Error fetching koottaymas:", error);
    }
  };

  const fetchFamilies = async (koottaymaId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/family/kottayma/${koottaymaId}`
      );
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
      setError("Failed to fetch families. Please try again.");
      setFamilies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFamilyDetails = async (familyId) => {
    try {
      const response = await axiosInstance.get(`/family/${familyId}`);
      const familyDetail = response.data;
      setFormData({
        id: familyDetail.id,
        name: familyDetail.name,
        building: familyDetail.building,
        phone: familyDetail.phone,
        street: familyDetail.street,
        city: familyDetail.city,
        district: familyDetail.district,
        pincode: familyDetail.pincode,
      });
    } catch (error) {
      console.error("Error fetching forane details:", error);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/family/${formData.id}`, formData);
      } else {
        await axiosInstance.post("/family/", {
          ...formData,
          forane: selectedForane,
          parish: selectedParish,
          koottayma: selectedKoottayma,
        });
      }
      fetchFamilies(selectedKoottayma);
      resetForm();
    } catch (error) {
      console.error("Error saving family:", error);
    }
  };

  const handleEdit = (family) => {
    fetchFamilyDetails(family.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      try {
        await axiosInstance.delete(`/family/${id}`);
        fetchFamilies(selectedKoottayma);
      } catch (error) {
        console.error("Error deleting family:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      building: "",
      phone: "",
      street: "",
      city: "",
      district: "",
      pincode: "",
    });
    setSelectedFamily(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Family Management</h1>

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

      {selectedParish && (
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="koottaymaSelect"
          >
            Select Koottayma
          </label>
          <select
            id="koottaymaSelect"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedKoottayma}
            onChange={(e) => setSelectedKoottayma(e.target.value)}
          >
            <option value="">Select a Koottayma</option>
            {koottaymas.map((koottayma) => (
              <option key={koottayma._id} value={koottayma._id}>
                {koottayma.name}
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
          {isEditing ? "Edit Family" : "Add New Family"}
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
              htmlFor="name"
            >
              ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="id"
              value={formData.id}
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
              required
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
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditing ? "Update Family" : "Add Family"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>

      {isLoading && <p>Loading families...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {families.map((family) => (
            <tr key={family._id}>
              <td className="py-2 px-4 border-b">{family.name}</td>
              {/* <td className="py-2 px-4 border-b">{family.phone}</td>
              <td className="py-2 px-4 border-b">{family.city}</td> */}
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                  onClick={() => handleEdit(family)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(family.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Family;
