import { useState, useEffect } from "react";
import {
  isAdmin,
  getMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
} from "../firebase/api";
import Modal from "react-modal";
import { Material, MaterialAdd } from "../interfaces/Common"; // Assuming you have a Material interface

const Admin = () => {
  const [admin, setAdmin] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newMaterialName, setNewMaterialName] = useState<string>("");
  const [newMaterialImage, setNewMaterialImage] = useState<string>("");
  const [newMaterialUnitPrice, setNewMaterialUnitPrice] = useState<number>(0);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    };

    const fetchMaterials = async () => {
      const materialsData: Material[] = await getMaterials();
      setMaterials(materialsData);
    };

    checkAdminStatus();
    fetchMaterials();
  }, []);

  const handleUnitPriceChange = (id: string, newUnitPrice: number) => {
    const updatedMaterials = materials.map((material: Material) => {
      if (material.id === id) {
        return { ...material, unitPrice: newUnitPrice };
      }
      return material;
    });

    setMaterials(updatedMaterials);
    updateMaterial(id, newUnitPrice);
  };

  const handleRemoveMaterial = (id: string) => {
    const updatedMaterials = materials.filter(
      (material: Material) => material.id !== id
    );
    setMaterials(updatedMaterials);
    removeMaterial(id);
  };

  const handleAddMaterial = async () => {
    const newMaterial: MaterialAdd = {
      name: newMaterialName,
      image: newMaterialImage,
      unitPrice: newMaterialUnitPrice,
    };

    const addedMaterial = await addMaterial(newMaterial);
    if (addedMaterial) {
      setMaterials([...materials, addedMaterial]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center md:p-10 p-2">
      {admin ? (
        <>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Admin Dashboard
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-3 py-1.5 bg-indigo-600 text-sm font-semibold text-white rounded-md hover-bg-indigo-500"
          >
            Add Material
          </button>

          <div className="grid grid-cols-1 gap-8 w-full m-10">
            {materials.map((material: Material) => (
              <div
                key={material.id}
                className="bg-white rounded-lg shadow-md p-4 mb-8"
              >
                <div className="flex items-center">
                  <img
                    src={material.image}
                    alt={`${material.name} Image`}
                    width={500}
                    height={300}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                    <div className="mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={material.unitPrice}
                        onChange={(e) =>
                          handleUnitPriceChange(
                            material.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 mt-1 block rounded-md border-gray-300 shadow-sm focus-ring-indigo-500 focus-border-indigo-500 sm-text-sm"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveMaterial(material.id)}
                      className="mt-2 text-red-600 hover-text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="modal-content p-10 rounded-md bg-white border-solid border-2 border-gray-400 m-10"
            style={{ content: { display: "flex", flexDirection: "column" } }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Add New Material
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  type="text"
                  placeholder="Enter material name"
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus-ring-indigo-500 focus-border-indigo-500 sm-text-sm"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Image URL</span>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  onChange={(e) => setNewMaterialImage(e.target.value)}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus-ring-indigo-500 focus-border-indigo-500 sm-text-sm"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Unit Price</span>
                <input
                  type="number"
                  placeholder="Enter unit price"
                  onChange={(e) =>
                    setNewMaterialUnitPrice(parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus-ring-indigo-500 focus-border-indigo-500 sm-text-sm"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover-bg-red-700 focus-outline-none focus-ring-2 focus-ring-offset-2 focus-ring-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover-bg-indigo-700 focus-outline-none focus-ring-2 focus-ring-offset-2 focus-ring-indigo-500"
              >
                Add
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <p>Loading or You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default Admin;
