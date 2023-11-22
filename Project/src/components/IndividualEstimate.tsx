import React, { useState, useEffect } from "react";
import {
  getMaterials,
  getUserEstimate,
  isUser,
  updateUserEstimate,
} from "../firebase/api"; // Import the necessary functions from api.ts
import { Estimate, Material } from "../interfaces/Common"; // Import the Material interface
import { useNavigate } from "react-router-dom";

const UserEstimate: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [rows, setRows] = useState<Estimate[]>([
    { materialId: "", quantity: 0 },
  ]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the list of materials from Firestore
    const checkUserStatus = async () => {
      const user = await isUser();
      if (!user) {
        navigate("/login");
      }
      setUserId(user);
      const estimate = await getUserEstimate(user);
      if (estimate) {
        setRows(estimate);
      }
    };
    const fetchMaterials = async () => {
      const materialsData = await getMaterials();
      setMaterials(materialsData);
    };
    checkUserStatus();
    fetchMaterials();
  }, []);

  const handleMaterialChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      materialId: event.target.value,
    };
    setRows(updatedRows);
    updateUserEstimate(userId, updatedRows);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      quantity: parseInt(event.target.value, 10),
    };
    setRows(updatedRows);
    updateUserEstimate(userId, updatedRows);
  };

  const calculateTotalPrice = (materialId: string, quantity: number) => {
    // Find the selected material from the list
    const material = materials.find((mat) => mat.id === materialId);

    if (material) {
      // Calculate the total price based on the material's unit price and quantity
      const materialPrice = material.unitPrice;
      return materialPrice * quantity;
    }
    return 0;
  };

  useEffect(() => {
    // Calculate the grand total
    let total = 0;
    for (const row of rows) {
      total += calculateTotalPrice(row.materialId, row.quantity);
    }
    setGrandTotal(total);
  }, [rows]);

  const addRow = () => {
    setRows([...rows, { materialId: "", quantity: 0 }]);
  };

  return (
    <div className="md:p-10 p-2">
      <h2 className="text-2xl font-bold mb-4">User Estimate Page</h2>
      <div className="border p-4 rounded-md bg-white mb-4">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className="w-3/5 flex flex-row gap-3 items-center justify-center">
              {row.materialId && (
                <img
                  src={
                    materials.find((mat) => mat.id === row.materialId)?.image
                  }
                  alt={`${row.materialId}-image`}
                  className="w-8 h-8"
                />
              )}
              {/* <label
                htmlFor={`materialSelect${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Material:
              </label> */}
              <select
                id={`materialSelect${index}`}
                value={row.materialId}
                onChange={(e) => handleMaterialChange(e, index)}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a Material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/5">
              {/* <label
                htmlFor={`quantityInput${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Quantity:
              </label> */}
              <input
                type="number"
                id={`quantityInput${index}`}
                value={row.quantity}
                onChange={(e) => handleQuantityChange(e, index)}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <p className="w-2/5">
              Price: Rs {calculateTotalPrice(row.materialId, row.quantity)}
            </p>
          </div>
        ))}
        <button onClick={addRow} className="bg-indigo-600 text-white px-3 py-1">
          Add Row
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Grand Total: Rs {grandTotal}
        </h3>
      </div>
    </div>
  );
};

export default UserEstimate;
