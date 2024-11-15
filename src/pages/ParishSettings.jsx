import { useState, useEffect } from "react";
import { FaChurch } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig.jsx";
import TotalAmountModal from "../components/TotalAmountModal.jsx";
import SlabsModal from "../components/SlabsModal.jsx";
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
  const [totalAmount, setTotalAmount] = useState(100000);
  const [totalPreProportionalShare, setTotalPreProportionalShare] = useState(0);
  const [prePropPercent, setPrePropPercent] = useState(0);
  const [totalPrelim, setTotalPrelim] = useState(0);
  const [parishData, setParishData] = useState([
    {
      name: "St.Parish",
      collection: 32234,
      prelim: 0,
      prop: 23142,
      total: 23425,
      pre_prop: 0,
    },
    {
      name: "St.Antony's",
      collection: 24352,
      prelim: 0,
      prop: 23142,
      total: 23425,
      pre_prop: 0,
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
    assignPrelimAllocation();
  }, [savedSlabs]);
  useEffect(() => {
    console.log("second", parishData);
  }, [parishData]);
  useEffect(() => {
    console.log("total pre prop share is" + totalPreProportionalShare);

    calTotalPreProp();
    calTotalPrelim();
    calPropPercent(), [totalPreProportionalShare];
  });
  useEffect(() => {
    console.log("total prelim is" + totalPrelim);
  }, [totalPrelim]);
  const assignPrelimAllocation = () => {
    // Create a new array for updated parish data
    console.log("calculation done");
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

      // Determine prelim value based on slabs
      let prelim = parish.prelim;
      if (matchingSlab) {
        prelim = matchingSlab.maxValue;
      } else if (parish.collection > maxOfBiggestSlab) {
        prelim = maxOfBiggestSlab;
      }

      // Return updated parish object including per_prop calculation
      return {
        ...parish,
        prelim,
        pre_prop: prelim > 0 ? parish.collection - prelim : 0,
      };
    });

    // Update the state with the modified parish data array
    setParishData(updatedParishData);
  };
  const handleSaveSlabs = (slabs) => {
    console.log("Saved slabs:", slabs);
    setSavedSlabs(slabs); // Store or send data to backend
  };
  const calTotalPreProp = () => {
    let total_pre_proportional_share = 0;
    parishData.map((parish) => {
      parish.pre_prop && (total_pre_proportional_share += parish.pre_prop);
    });
    setTotalPreProportionalShare(total_pre_proportional_share);
  };
  const calTotalPrelim = () => {
    let total_prelim = 0;
    parishData.map((parish) => {
      parish.prelim && (total_prelim += parish.prelim);
    });
    setTotalPrelim(total_prelim);
  };
  const calPropPercent = () => {
    setPrePropPercent(
      ((totalAmount - totalPrelim) / totalPreProportionalShare) * 100
    );
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
        <div>
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
          <div className="flex justify-around text-[1.5rem] w-full gap-[4rem]">
            <h1>Total Pre-Proportional Amount = {totalPreProportionalShare}</h1>
            <h1>Proportional Share % = {prePropPercent}</h1>
          </div>
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
        <h1 className="text-[1.2rem] py-2">Total Prelim = {totalPrelim}</h1>
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
