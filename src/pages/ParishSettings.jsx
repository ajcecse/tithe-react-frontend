import { useState, useEffect } from "react";
import { FaChurch } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig.jsx";
import TotalAmountModal from "../components/TotalAmountModal.jsx";
import SlabsModal from "../components/SlabsModal.jsx";
const totalAmount = 100000;
const handleSaveTotalAmount = (data) => {
  console.log("Saved data:", data);
  // Update state or send data to backend
};
// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg w-[80%] max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ParishSettings = () => {
  const navigate = useNavigate();
  const [parishData, setParishData] = useState([
    {
      name: "St.Parish",
      collection: 32234,
      prelim: 0,
      prop: 23142,
      total: 23425,
    },
    {
      name: "St.Antony's",
      collection: 24352,
      prelim: 0,
      prop: 23142,
      total: 23425,
    },
  ]);
  // Modal visibility state
  const [isTotalAmountModalOpen, setIsTotalAmountModalOpen] = useState(false);
  const [isChangeParishModalOpen, setIsChangeParishModalOpen] = useState(false);
  const [isSlabsModalOpen, setSlabsModalOpen] = useState(false);
  const [savedSlabs, setSavedSlabs] = useState([
    { maxValue: "0", minValue: 0 },
  ]);

  useEffect(() => {
    console.log("this happend");
    assignPrelimAllocation();
  }, [savedSlabs]);

  const assignPrelimAllocation = () => {
    // Create a new array for updated parish data

    const updatedParishData = parishData.map((parish) => {
      // Find the matching slab based on the collection value
      const matchingSlab = savedSlabs.find(
        (slab) =>
          slab.minValue <= parish.collection &&
          parish.collection <= slab.maxValue
      );

      // Get the maximum value from the biggest slab for comparison
      const maxOfBiggestSlab = Math.max(
        ...savedSlabs.map((slab) => slab.maxValue)
      );

      // If a matching slab is found, update prelim with maxValue of that slab
      if (matchingSlab) {
        return { ...parish, prelim: matchingSlab.maxValue };
      }
      // If collection exceeds maxValue of the biggest slab, set prelim to maxOfBiggestSlab
      else if (parish.collection > maxOfBiggestSlab) {
        return { ...parish, prelim: maxOfBiggestSlab };
      }

      // Otherwise, return parish as is
      return parish;
    });

    // Update the state with the modified parish data array
    setParishData(updatedParishData);
  };
  const handleSaveSlabs = (slabs) => {
    console.log("Saved slabs:", slabs);
    setSavedSlabs(slabs); // Store or send data to backend
  };
  return (
    <div className="w-full flex flex-col items-center p-[5rem]">
      <FaChurch className="text-[4rem]" />
      <h1 className="text-[2.5rem] font-bold mb-2">Parish Settings</h1>
      <div className="flex flex-col items-center">
        <div className="flex gap-[10rem] w-full p-5">
          <div className="flex gap-[3rem] text-[1.5rem]">
            <h2 className="font-bold">Total Amount</h2>
            <h2>{totalAmount}</h2>
          </div>
        </div>
      </div>

      <div className="flex items-center w-full p-5 flex-col">
        {/* Buttons to open modals */}
        <div className="flex gap-[5rem] justify-center items-center w-full py-2">
          <button
            onClick={() => setIsTotalAmountModalOpen(true)}
            className="p-3 bg-green-500 text-white rounded-lg"
          >
            Edit Total Amount
          </button>
          <button
            onClick={() => setIsChangeParishModalOpen(true)}
            className="p-3 bg-green-500 text-white rounded-lg"
          >
            Change Specific Parish
          </button>
          <button
            onClick={() => setSlabsModalOpen(true)}
            className="p-3 bg-green-500 text-white rounded-lg"
          >
            Slab Settings
          </button>
        </div>

        {/* Table for settings data */}
        <table className="border-[1px] bg-white rounded-xl mt-5">
          <thead className="text-[1.5rem]">
            <tr>
              <th className="p-5">Parish</th>
              <th className="p-5">Collection</th>
              <th className="p-5">Prelim Allocation</th>
              <th className="p-5">Proportional Share Amount</th>
              <th className="p-5">Total Allocated</th>
            </tr>
          </thead>
          <tbody className="text-[1.2rem] text-center">
            {parishData.map((parish, index) => (
              <tr key={index}>
                <td className="p-3">{parish.name}</td>
                <td className="p-3">{parish.collection}</td>
                <td className="p-3">{parish.prelim}</td>
                <td className="p-3">{parish.prop}</td>
                <td className="p-3">{parish.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <TotalAmountModal
        isOpen={isTotalAmountModalOpen}
        onClose={() => setIsTotalAmountModalOpen(false)}
        title="Edit Total Amount"
        totalBalance={30000}
        onSave={handleSaveTotalAmount}
      />

      <Modal
        isOpen={isChangeParishModalOpen}
        onClose={() => setIsChangeParishModalOpen(false)}
        title="Change Specific Parish"
      >
        <p>Content for changing specific parish goes here.</p>
      </Modal>

      <SlabsModal
        isOpen={isSlabsModalOpen}
        onClose={() => setSlabsModalOpen(false)}
        onSave={handleSaveSlabs}
      />
    </div>
  );
};

export default ParishSettings;
