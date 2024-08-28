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
  const [searchID, setSearchID] = useState("");
  const [displayRes, setDisplayRes] = useState(null);
  const [isTransaction, setIsTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionData, setTransactionData] = useState({
    type: "",
    amountPaid: "",
    date: "",
    description: "",
  });
  const [totalTransactions, setTotalTransactions] = useState(0);
  const relationOptions = [
    "head",
    "bride",
    "groom",
    "son",
    "daughter",
    "father",
    "mother",
    "brother",
    "sister",
  ];
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
    if (selectedFamily) {
      fetchPersons(selectedFamily);
    }
  }, [selectedFamily]);

  useEffect(() => {
    if (formData._id) {
      fetchTransactions(formData._id);
    }
  }, [formData]);

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
    try {
      const response = await axiosInstance.get(
        `/family/kottayma/${koottaymaId}`
      );
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchPersons = async (familyId) => {
    try {
      const response = await axiosInstance.get(`/person/family/${familyId}`);
      fetchFamilyDetails(response.data);
      setPersons(response.data || []);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };
  const fetchTransactions = async (personId) => {
    try {
      const response = await axiosInstance.get(
        `/person/${personId}/transactions`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchPersonDetails = async (personId) => {
    try {
      const response = await axiosInstance.get(`/person/${personId}`);
      response.data.dob = formatDate(response.data.dob);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const fetchFamilyDetails = async (persons) => {
    try {
      // Use Promise.all to wait for all asynchronous calls to complete
      const responses = await Promise.all(
        persons.map(async (p) => {
          const response = await axiosInstance.get(`/person/${p._id}`);
          return response.data; // or whatever data you want to return
        })
      );
      setPersons(responses); // This will be an array of all responses
      return responses;
    } catch (error) {
      console.error("Error fetching family details:", error);
      throw error; // Re-throw if you want it to be handled by the caller
    }
  };

  const handleSelectChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleTransactionChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
      forane: selectedForane,
      parish: selectedParish,
      family: selectedFamily,
    });
  };
  const handleAddTransaction = async () => {
    try {
      const response = await axiosInstance.post(
        `transaction/`,
        transactionData
      );
      setTransactions([...transactions, response.data]);
      setTransactionData({
        amountPaid: "",
        date: "",
        forane: selectedForane,
        parish: selectedParish,
        family: selectedFamily,
      });
      totalPersonTransaction(transactionData.person);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const totalPersonTransaction = async (personId) => {
    try {
      const response = await axiosInstance.get(
        `transaction/person/${personId}`
      );
      setTotalTransactions(response.data.totalAmount);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };
  function formatDateSubmit(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  const handleEdit = (personId) => {
    const personDetails = fetchPersonDetails(personId);
    setFormData(personDetails);
    setIsEditing(!isEditing);
  };
  const handleTransaction = (personId) => {
    totalPersonTransaction(personId);
    setTransactionData({
      person: personId,
    });
    setIsTransaction(!isTransaction);
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
    formData.dob = formatDateSubmit(formData.dob);
    try {
      if (isEditing) {
        await axiosInstance.put(`/person/${formData._id}`, formData);
      } else {
        await axiosInstance.post("/person/", {
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

  const handleSearchInputChange = (e) => {
    setSearchID(e.target.value);
    console.log(searchID);
    if (searchID.length == 6) {
      setSelectedFamily(searchID);
      setDisplayRes(true);
    } else {
      setDisplayRes(false);
    }
  };
  return (
    <div className="container mx-auto flex flex-col items-center ">
      <h1 className="text-3xl font-bold p-10">Family Finances</h1>
      <div className="min w-full flex justify-around">
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
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">
            Enter Famliy ID and click SPACE
          </label>
          <input
            type="text"
            placeholder="Enter Family ID"
            value={searchID}
            onChange={handleSearchInputChange}
            className="p-2"
          />
        </div>
      </div>
      {selectedFamily && displayRes && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Persons in Family</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Baptism Name</th>
                <th className="p-4 border-b">Relation</th>
                <th className="p-4 border-b">Gender</th>
                <th className="p-4 border-b">DOB</th>
                <th className="p-4 border-b">Occupation</th>
                <th className="p-4 border-b">Education</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person._id}>
                  <td className="py-2 pl-[3rem] border-b">{person.name}</td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.baptismName}
                  </td>
                  <td className="py-2 pl-[3rem] border-b">{person.relation}</td>
                  <td className="py-2 pl-[3rem] border-b">{person.gender}</td>
                  <td className="py-2 pl-[3rem] border-b">{person.dob}</td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.occupation}
                  </td>
                  <td className="py-2 pl-[3rem] border-b">
                    {person.education}
                  </td>
                  <td className="py-2 border-b flex justify-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(person._id)}
                    >
                      ✎
                    </button>
                    <button
                      className="bg-green-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleTransaction(person._id)}
                    >
                      $
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(person._id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && (
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
                Select Relation
              </label>
              <select
                name="relation"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.relation || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Relation</option>
                {relationOptions.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education || ""}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation || ""}
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
                Update
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
      {isTransaction && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Manage Transactions</h3>

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Total Payed till now
          </label>
          <p className="text-lg">{totalTransactions}</p>
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Amount
          </label>
          <input
            type="number"
            name="amountPaid"
            value={transactionData.amountPaid}
            onChange={handleTransactionChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={transactionData.date}
            onChange={handleTransactionChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <button
            type="button"
            onClick={handleAddTransaction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;
