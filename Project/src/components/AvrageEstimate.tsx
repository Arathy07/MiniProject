import React, { useState, FormEvent, useEffect } from "react";
import { Material } from "../interfaces/Common";
import { getMaterials, isUser } from "../firebase/api";
import { useNavigate } from "react-router-dom";

const AverageEstimate: React.FC = () => {
  const [sqft, setSqft] = useState<number>(100);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [grandTotal, setGrandTotal] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = await isUser();
      if (!user) {
        navigate("/login");
      }
      setUserId(user);
      console.log(userId);
    };

    const fetchMaterials = async () => {
      const materialsData = await getMaterials();
      setMaterials(materialsData);
    };

    checkUserStatus();
    fetchMaterials();
  }, []);

  const handleSqftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (/^\d*$/.test(input) || input === "") {
      setSqft(input === "" ? 1 : parseInt(input, 10));
      setSubmitted(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    calculateGrandTotal();
  };

  const calculateGrandTotal = () => {
    const total = materials
      .filter((m) => m.pricePer500sqft)
      .reduce((acc, mat) => {
        if (mat.pricePer500sqft) {
          const price = ((mat.pricePer500sqft / 5) * sqft) / 100;
          return acc + price;
        }
        return acc;
      }, 0);
    setGrandTotal(total);
  };

  return (
    <div className="md:p-10 p-2">
      <h2 className="text-2xl font-bold mb-4">Average estimate</h2>
      <form onSubmit={handleSubmit}>
        <div className="border p-4 rounded-md bg-white mb-4 flex gap-8 items-center">
          <label htmlFor="sqft" className="text-lg">
            Give the average sqft for your plan:
          </label>
          <input
            type="number"
            id="sqft"
            name="sqft"
            value={sqft}
            onChange={handleSqftChange}
            className="p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>

      {submitted && (
        <div className="p-2 rounded-md">
          {materials
            .filter((m) => m.pricePer500sqft)
            .map((mat, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                {mat.pricePer500sqft && (
                  <>
                    <div className="w-1/5 flex flex-row gap-3 items-center justify-start">
                      {mat.id && (
                        <img
                          src={mat.image}
                          alt={`${mat.id}-image`}
                          className="w-8 h-8"
                        />
                      )}
                    </div>
                    <div className="w-2/5">
                      <p>{mat.name}</p>
                    </div>
                    <div className="w-1/5">
                      <p>
                        {/* Units:{" "} */}
                        <span>
                          {Math.round(
                            ((mat.pricePer500sqft / 5) * sqft) /
                              mat.unitPrice /
                              100
                          )}
                        </span>
                      </p>
                    </div>
                    <p className="w-2/5">
                      Total: Rs {((mat.pricePer500sqft / 5) * sqft) / 100}
                    </p>
                  </>
                )}
              </div>
            ))}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Total cost for materials : Rs {grandTotal}
            </h3>
            <h3 className="text-lg font-semibold text-gray-700">
              Grand Total: Rs {1900 * sqft}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageEstimate;
