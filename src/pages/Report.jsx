import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed

const Report = () => {
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
  const [dropdown, setDropdown] = useState(false);
  const [saved, setSaved] = useState(false);
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

      //get the previous data
      // const prev = totalPersonTransaction():
      setCurrentTransaction([]);
      setDisplayRes(true);
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

  const handleTransactionChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
      forane: selectedForane,
      parish: selectedParish,
      family: selectedFamily,
    });
  };
  const handleAddTransaction = async (current) => {
    try {
      await axiosInstance.post(`transaction/`, current);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const totalPersonTransaction = async (personId) => {
    try {
      const response = await axiosInstance.get(
        `transaction/person/${personId}`
      );
      console.log(response.data);
      if (response.data.totalAmount) {
        return response.data.totalAmount;
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
  const handleTransaction = () => {
    currentTransaction.map((p) => {
      handleAddTransaction({
        amountPaid: p.amountPaid,
        person: p.id,
        forane: selectedForane,
        family: selectedFamily,
        parish: selectedParish,
      });
      totalPersonTransaction(p.id);
      setSaved(true);
    });

    // setTransactionData({
    //   person: personId,
    // });
    // setIsTransaction(!isTransaction);
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

  const handleCurrentChange = (e, personId) => {
    const current = e.target.value;
    if (!isNaN(current) && current.trim() !== "") {
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
  return (
    <div></div>
    //     <div>
    //       <div class="header">
    //     <img src="cropped-eparchy_klpyEBM.png" alt="Logo">
    //     <div class="header-text">
    //         <h2 class="malayalam-text" style="font-size:70px">Poh³ 2024 </h2>
    //         <h4 class="malayalam-text1" style="font-size:35px">Imªnc¸Ån cq]X </h4>
    //         <p class="malayalam-text2" style="font-size:25px">]¦phbv¡eneqsS Pohsâ kar²nbntebv¡v </p>
    //         <p class="malayalam-text3" style="font-size:18px">\³asN¿p¶Xnepw \n§Ä¡pÅh ]¦phbv¡p¶Xnepw Dt]Ivj hcp¯cpXv. A¯cw _enIÄ ssZh¯n\p {]oXnIcamWv.(sl{_mbÀ 13:16)</p>
    //     </div>
    // </div>
    // <hr style="margin:0px;"/><hr style="margin-top: 0px;"/>
    // <div class="details-container">
    //     <div class="details-item">
    //         <strong class="malayalam-text3" style="font-size:18px;font-weight: 100;">CShI:</strong>
    //          <strong>THARAKANATTUKUNNU</strong>
    //     </div>
    //     <div class="details-item">
    //         <strong class="malayalam-text3" style="font-size:18px;font-weight: 100;">ho«pt]cv:</strong>
    //          <strong>PULLOLICKEL</strong>
    //     </div>
    //     <div class="details-item">
    //         <strong class="malayalam-text3" style="font-size:18px;font-weight: 100;">IpSpw_ \mY³/\mYbpsS \maw</strong> <strong>ELSAMMA</strong>
    //     </div>
    //     <div class="details-item">
    //         <strong class="malayalam-text3" style="font-size:18px;font-weight: 100;">
    //             Iq«mbva </strong>
    //             <strong>10A ST. MICHAEL</strong>
    //     </div>
    //     <div class="details-item">
    //         <strong class="malayalam-text3" style="font-size:18px;font-weight: 100;">hnemkw:</strong> <strong>CHERUVALLY, 686 543</strong>
    //     </div>
    //     <div class="details-item">
    //         <strong  class="malayalam-text3" style="font-size:18px;font-weight: 100;">
    //             t^m¬ \¼À:</strong>
    //             <strong> 9497321477</strong>
    //     </div>
    // </div>

    // <div class="table-container" style="padding-bottom: 15px;">
    //     <table>
    //         <thead>
    //             <tr>
    //                <th class="malayalam-text3" style="font-size:15px">{Ia \¼À</th>
    //                 <th class="malayalam-text3" style="font-size:15px">amt½mZok t]cv</th>
    //                 <th class="malayalam-text3" style="font-size:15px">hnfn¡p¶ t]cv</th>
    //                 <th class="malayalam-text3" style="font-size:15px">IpSpw_ \mY\pambpÅ _Ôw </th>
    //                 <th class="malayalam-text3" style="font-size:15px">]q /kv{Xo </th>
    //                 <th class="malayalam-text3" style="font-size:15px">P\\ XobXn</th>
    //                 <th class="malayalam-text3" style="font-size:15px">sXmgnÂ</th>
    //                 <th class="malayalam-text3" style="font-size:15px">hnZym`ymkw</th>
    //                 <th class="malayalam-text3" style="font-size:15px">Zimwiw 03-22</th>
    //                 <th class="malayalam-text3" style="font-size:15px">Zimwiw 2023</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             <tr>
    //                 <td>1</td>
    //                 <td>ALEY</td>
    //                 <td>ELSAMMA</td>
    //                 <td style="font-size:10px">FAMILY HEAD</td>
    //                 <td>F</td>
    //                 <td>07-06-1944</td>
    //                 <td>RTD TEACHER</td>
    //                 <td>B.A, B.ED</td>
    //                 <td>3345</td>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td>2</td>
    //                 <td>STANSLAVUS</td>
    //                 <td>FR. STANLY</td>
    //                 <td>SON</td>
    //                 <td>M</td>
    //                 <td>30-11-1983</td>
    //                 <td>PRIEST</td>
    //                 <td>B.A</td>
    //                 <td>585</td>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td>3</td>
    //                 <td>ABRAHAM</td>
    //                 <td>ABY</td>
    //                 <td>SON</td>
    //                 <td>M</td>
    //                 <td>06-03-1986</td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>1770</td>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td>4</td>
    //                 <td>MARY</td>
    //                 <td>REMYA</td>
    //                 <td>DAUGHTER IN LAW</td>
    //                 <td>F</td>
    //                 <td>07-03-1989</td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>400</td>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td>5</td>
    //                 <td>EAPEN</td>
    //                 <td>EAPEN</td>
    //                 <td>GRAND SON</td>
    //                 <td>M</td>
    //                 <td>29-06-2019</td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>200</td>
    //                 <td></td>
    //             </tr>
    //               <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td> </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //             </tr>
    //               <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td> </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //             </tr>
    //             <tr>

    //      <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td> </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //             </tr>
    //             <tr>

    //      <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td> </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //             </tr>
    //             <tr>

    //             <tr>

    //             <tr>
    //                 <td colspan="9" style="text-align: right;"><strong>TOTAL</strong></td>
    //                 <td>6300</td>
    //             </tr>
    //         </tbody>
    //     </table>
    // </div>
    // <div style="border: 1px solid #000;border-radius: 8px;">
    // <div class="footer-section">
    //     <div class="left-section">
    //         <span><strong class="malayalam-text3" style="font-size:18px;font-weight: 100;"> IpSpw_\mYsâ t]cv:  </strong></span>
    //     </div>
    //     <div class="right-section">
    //         <span><strong class="malayalam-text3" style="font-size:18px;font-weight: 100;"> hnImcnbpsS t]cv:</strong></span>
    //     </div>
    // </div>

    // <div class="seal-section" style="padding-top: 20px;">
    //     <span class="date malayalam-text3" style="font-size:18px;font-weight: 100;">XnbXn :</span>
    //     <span class="seal malayalam-text3" style="font-size:18px;font-weight: 100;">]ÅnbpsS koÂ </span>
    //     <span class="empty"></span>
    // </div>
    // </div>
    // <hr style="margin:0px;"/><hr style="margin-top: 0px;"/>
  );
};

export default Report;
