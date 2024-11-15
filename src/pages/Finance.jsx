/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed
import malaylamText from "../assets/malayalamText";
import { IoMdArrowBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import logo from "../assets/cropped-eparchy_klpyEBM.png";
import html2pdf from "html2pdf.js";
const FamilyManagement = () => {
  const [familyHead, setFamilyHead] = useState("");
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
  const [currentTransactions, setCurrentTransactions] = useState([
    { amountPaid: 0 },
  ]);
  const [dropdown, setDropdown] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [transactionData, setTransactionData] = useState({
    type: "",
    amountPaid: "",
    date: "",
    description: "",
  });
  const [currentTransaction, setCurrentTransaction] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState([]);
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
  const [report, setReport] = useState(false);
  const [parishName, setParishName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [kootaymaName, setKootaymaName] = useState("");
  const [familyTotal, setFamilyTotal] = useState(0);
  const [print, setPrint] = useState(false);
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
      //get the previous data
      // const prev = totalPersonTransaction():
      setCurrentTransaction([]);
      setDisplayRes(true);
      fetchPersons(selectedFamily);
    }
  }, [selectedFamily]);

  useEffect(() => {
    if (persons.length > 0 || saved) {
      const fetchAllTransactions = async () => {
        const allTransactions = await Promise.all(
          persons.map(async (p) => {
            const totalAmount = await totalPersonTransaction(p._id);
            return totalAmount;
          })
        );
        setTransactions(allTransactions);
      };

      fetchAllTransactions();
      setSaved(false);
    }
  }, [persons, saved]);

  useEffect(() => {
    if (persons.length > 0 || saved) {
      const fetchAllCurrentTransactions = async () => {
        const allCurrentTransactions = await Promise.all(
          persons.map(async (p) => {
            const currentAmount = await currentPersonTransaction(p._id);
            return {
              amountPaid: currentAmount.amountPaid,
              id: currentAmount._id,
              person: p._id,
            };
          })
        );
        console.log(allCurrentTransactions);
        setCurrentTransactions(allCurrentTransactions);
      };

      fetchAllCurrentTransactions();
    }
  }, [persons]);

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
      response.data.map((p) => {
        fetchPersons(p.id);
      });

      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchPersons = async (familyId) => {
    try {
      const response = await axiosInstance.get(`/person/family/${familyId}`);
      response.data.map((p) => {
        if (p.relation === "head") {
          setFamilyHead(p.name);
        }
      });
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
      console.log(response.data);
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
          setTotalTransactions((prevTotalTransactions) => {
            // Check if the personId already exists in the array
            const existingTransaction = prevTotalTransactions.find(
              (item) => item.id === p._id
            );

            if (existingTransaction) {
              // Update the existing transaction
              return prevTotalTransactions.map((item) =>
                item.id === p._id
                  ? { ...item, amountPaid: totalPersonTransaction(p._id) }
                  : item
              );
            } else {
              // Add a new transaction
              return [
                ...prevTotalTransactions,
                { id: p._id, amountPaid: totalPersonTransaction(p._id) },
              ];
            }
          });
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

  const handleNewTransaction = async (current) => {
    try {
      await axiosInstance.post(`transaction/`, current);
      return true;
    } catch (error) {
      return false;
    }
  };

  const totalPersonTransaction = async (personId) => {
    try {
      const response = await axiosInstance.get(
        `transaction/person/${personId}`
      );
      if (response.data.totalAmount) {
        return response.data.totalAmount;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const currentPersonTransaction = async (personId) => {
    try {
      const response = await axiosInstance.get(
        `transaction/latest/person/${personId}`
      );
      if (response.data) {
        return response.data;
      } else {
        return 0;
      }
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

  const handleTransaction = async () => {
    try {
      setSaveButton(false);
      // Map each transaction to a promise
      const promises = currentTransactions.map((p) => {
        return handleNewTransaction({
          amountPaid: p.amountPaid,
          person: p.person,
          forane: selectedForane,
          family: selectedFamily,
          parish: selectedParish,
        });
      });

      // Wait for all the promises to resolve
      const results = await Promise.all(promises);

      // Iterate over the results and handle based on canAdd value
      results.forEach((canAdd, index) => {
        console.log(currentTransactions[index], canAdd);

        if (!canAdd) {
          updateCurrentTransaction(currentTransactions[index]);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setSaved(true);
  };
  // setTransactionData({
  //   person: personId,
  // });
  // setIsTransaction(!isTransaction);

  const updateCurrentTransaction = async (p) => {
    try {
      await axiosInstance.put(`transaction/${p.id}`, {
        amountPaid: p.amountPaid,
      });
    } catch (error) {
      console.log("Error updating transaction", error);
    }
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

  const handleCurrentChange = (e, index, personId) => {
    setSaveButton(true);
    let current = e.target.value;
    const newValues = [...currentTransactions];
    newValues[index].amountPaid = current;
    setCurrentTransactions(newValues);
    if (!isNaN(current)) {
      setCurrentTransaction((prevTransaction) => {
        // Check if the personId already exists in the array
        const existingTransaction = prevTransaction.find(
          (item) => item.id === personId
        );

        if (existingTransaction) {
          // Update the existing transaction
          return prevTransaction.map((item) =>
            item.id === personId ? { ...item, amountPaid: current } : item
          );
        } else {
          // Add a new transaction
          return [...prevTransaction, { id: personId, amountPaid: current }];
        }
      });
    }
  };

  // Report Functions

  const generateReport = () => {
    console.log(persons);
    setReport(true);
    fetchParishName();
    fetchFamilyName();
    fetchKottaymaName();
    fetchFamilyTotal();
  };

  const fetchParishName = async () => {
    try {
      const parish = await axiosInstance.get(`parish/${selectedParish}`);
      console.log(parish);
      setParishName(parish.data.name);
    } catch (error) {
      console.error("Error fetching parish name:", error);
    }
  };

  const fetchFamilyName = async () => {
    try {
      const family = await axiosInstance.get(`family/${selectedFamily}`);
      console.log(family);
      setFamilyName(family.data);
    } catch (error) {
      console.error("Error fetching family name", error);
    }
  };

  const fetchKottaymaName = async () => {
    try {
      const koottayma = await axiosInstance.get(
        `koottayma/${selectedKoottayma}`
      );
      console.log(koottayma);
      setKootaymaName(koottayma.data.name);
    } catch (error) {
      console.error("Error fetching kootayma name", error);
    }
  };

  const fetchFamilyTotal = async () => {
    var calFamilyTotal = 0;
    transactions.map((p) => {
      calFamilyTotal = calFamilyTotal + p;
    });

    setFamilyTotal(calFamilyTotal);
  };

  const handlePrint = () => {
    window.print(); // This will open the print dialog for the user
  };
  const pageRef = useRef();
  const handleGeneratePDF = () => {
    setPrint(true);
    const element = pageRef.current; // Get the DOM element to print
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "page-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save(); // Save the PDF
  };
  return !report ? (
    <div className="mx-auto flex flex-col items-center p-10 w-full">
      <h1 className="text-3xl font-bold py-5">Family Finances</h1>
      <div className="min w-full flex flex-col items-center justify-around">
        <div className="flex justify-around w-full">
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
                  {family.name} - {familyHead}
                </option>
              ))}
            </select>
          </div>
        </div>
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
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 py-5">Family Finances</h2>
          <button
            className="my-5 bg-blue-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
            onClick={generateReport}
          >
            Generate Report
          </button>
          <div className="flex flex-col items-center">
            {saveButton && (
              <button
                className=" mb-5 bg-green-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                onClick={handleTransaction}
              >
                Save Changes
              </button>
            )}
          </div>

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
                <th className="p-4 border-b">Total Amount</th>
                <th className="py-4 pr-4 pl-2 borde-b">Current Amount</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person, index) => (
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
                  <td className="py-2 pl-[3rem] border-b ">
                    <p>{transactions[index]}</p>
                  </td>
                  <td className="py-2 border-b flex justify-center">
                    <input
                      className="border border-black w-[50%] py-2 px-4"
                      type="number"
                      value={currentTransactions[index].amountPaid}
                      onChange={(e) =>
                        handleCurrentChange(e, index, person._id)
                      }
                    ></input>
                  </td>
                  <td className="py-2 border-b">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(person._id)}
                    >
                      ✎
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
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex"
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
    </div>
  ) : (
    <div ref={pageRef} className="report-body">
      {!print && (
        <div className="hide-in-print flex items-center text-[1.7rem] justify-center">
          <button
            className="my-5 bg-blue-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2 flex items-center gap-3"
            onClick={() => setReport(!report)}
          >
            <IoMdArrowBack />
            <h1>Go Back to Edit</h1>
          </button>
          <button
            className="my-5 bg-blue-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2 flex items-center gap-3"
            onClick={handlePrint}
          >
            <MdLocalPrintshop />
            <h1>Print</h1>
          </button>
          {/* <button
            className="my-5 bg-blue-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2 flex items-center gap-3"
            onClick={handleGeneratePDF}
          >
            <FaFilePdf />
            <h1>Generate PDF</h1>
          </button> */}
        </div>
      )}
      <div className="header">
        <img src={logo} alt="Logo" />
        <div className="header-text">
          <h2 className="malayalam-text">{malaylamText[0]}</h2>
          <h4 className="malayalam-text1">{malaylamText[1]}</h4>
          <p className="malayalam-text2">{malaylamText[2]}</p>
          <h5 className="malayalam-text3">{malaylamText[3]}</h5>
          <h1>Family ID:{familyName.id}</h1>
        </div>
      </div>
      <hr style={{ margin: "0px" }} />
      <hr style={{ marginTop: "0px" }} />
      <div className="details-container">
        <div className="details-item">
          <strong className="malayalam-text3">{malaylamText[4]}</strong>
          <strong>{parishName}</strong>
        </div>
        <div className="details-item">
          <strong className="malayalam-text3">{malaylamText[5]}</strong>
          <strong>{familyName.name}</strong>
        </div>
        <div className="details-item">
          <strong className="malayalam-text3"> {malaylamText[6]} :</strong>
          <strong>{familyHead}</strong>
        </div>
        <div className="details-item">
          <strong className="malayalam-text3">{malaylamText[7]} :</strong>
          <strong>{kootaymaName}</strong>
        </div>
        <div className="details-item">
          <strong className="malayalam-text3">{malaylamText[8]}</strong>{" "}
          <strong>{familyName.district + "," + familyName.pincode}</strong>
        </div>
        <div className="details-item">
          <strong className="malayalam-text3">{malaylamText[9]}</strong>
          <strong> 9497321477</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[10]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[11]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[12]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[13]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[14]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[15]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[16]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[17]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[18]}
              </th>
              <th
                className="malayalam-text3 report-th"
                style={{ fontSize: "15px" }}
              >
                {malaylamText[19]}
              </th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, index) => (
              <tr key={person._id}>
                <td className=" py-3 px-2 text-[0.75rem] report-td">
                  {index + 1}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.name}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.baptismName}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.relation}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.gender}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.dob}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.occupation}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td">
                  {person.education}
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td ">
                  <p>{transactions[index]}</p>
                </td>
                <td className="py-3 px-2 text-[0.75rem] report-td"></td>
              </tr>
            ))}
            <tr>
              <td
                className="report-td"
                colSpan="8"
                style={{ textAlign: "right" }}
              >
                <strong>TOTAL</strong>
              </td>
              <td className="report-td py-3 px-2 text-[0.75rem]">
                {familyTotal}
              </td>
              <td className="report-td"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ border: "1px solid #000", borderRadius: "8px" }}>
        <div className="footer-section">
          <div className="left-section">
            <span>
              <strong className="malayalam-text3">{malaylamText[20]}</strong>
            </span>
          </div>
          <div className="right-section">
            <span>
              <strong className="malayalam-text3">{malaylamText[21]}</strong>
            </span>
          </div>
        </div>

        <div className="seal-section" style={{ paddingTop: "20px" }}>
          <span className="date malayalam-text3">{malaylamText[22]}</span>
          <span className="seal malayalam-text3">{malaylamText[23]}</span>
          <span className="empty"></span>
        </div>
      </div>
    </div>
  );
};

export default FamilyManagement;
