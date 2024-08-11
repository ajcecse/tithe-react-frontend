import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const FamilyManagement = () => {
  const [foranes, setForanes] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [koottaymas, setKoottaymas] = useState([]);
  const [families, setFamilies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedForane, setSelectedForane] = useState("");
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedKoottayma, setSelectedKoottayma] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForanes();
  }, []);

  useEffect(() => {
    if (selectedForane) fetchParishes(selectedForane);
  }, [selectedForane]);

  useEffect(() => {
    if (selectedParish) fetchKoottaymas(selectedParish);
  }, [selectedParish]);

  useEffect(() => {
    if (selectedKoottayma) fetchFamilies(selectedKoottayma);
  }, [selectedKoottayma]);

  useEffect(() => {
    if (selectedFamily) fetchPersons(selectedFamily);
  }, [selectedFamily]);

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
      const response = await axiosInstance.get(`/koottayma/${parishId}`);
      setKoottaymas(response.data || []);
    } catch (error) {
      console.error("Error fetching koottaymas:", error);
    }
  };

  const fetchFamilies = async (koottaymaId) => {
    try {
      const response = await axiosInstance.get(`/family/${koottaymaId}`);
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchPersons = async (familyId) => {
    try {
      const response = await axiosInstance.get(`/person/${familyId}`);
      setPersons(response.data || []);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const handleSelectChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleEdit = (person) => {
    person.dob = formatDate(person.dob);
    setFormData(person);
    setIsEditing(true);
  };

  const handleDelete = async (personId) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await axiosInstance.delete(`/person/${personId}`);
        fetchPersons(selectedFamily);
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/person/${formData._id}`, formData);
      } else {
        await axiosInstance.post("/person/newperson", {
          ...formData,
          family: selectedFamily,
          forane: selectedForane,
          parish: selectedParish,
        });
      }
      fetchPersons(selectedFamily);
      resetForm();
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  const resetForm = () => {
    setFormData({});
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Family Finance Management</h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Forane
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedForane}
          onChange={handleSelectChange(setSelectedForane)}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Parish
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedParish}
            onChange={handleSelectChange(setSelectedParish)}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Koottayma
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedKoottayma}
            onChange={handleSelectChange(setSelectedKoottayma)}
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

      {selectedKoottayma && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Family
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedFamily}
            onChange={handleSelectChange(setSelectedFamily)}
          >
            <option value="">Select a Family</option>
            {families.map((family) => (
              <option key={family._id} value={family._id}>
                {family.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedFamily && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Persons in Family</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 border-b">Name</th>
                <th className="py-2 border-b">Baptism Name</th>
                <th className="py-2 border-b">Gender</th>
                <th className="py-2 border-b">DOB</th>
                <th className="py-2 border-b">Phone</th>
                <th className="py-2 border-b">Relation</th>
                <th className="py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person._id}>
                  <td className="py-2 px-4 border-b">{person.name}</td>
                  <td className="py-2 px-4 border-b">{person.baptismName}</td>
                  <td className="py-2 px-4 border-b">{person.gender}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(person.dob).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{person.phone}</td>
                  <td className="py-2 px-4 border-b">{person.relation}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(person)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(person._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedFamily && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">
            {isEditing ? "Edit Person" : "Add Person"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Baptism Name
              </label>
              <input
                type="text"
                name="baptismName"
                value={formData.baptismName || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Relation
              </label>
              <input
                type="text"
                name="relation"
                value={formData.relation || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;
