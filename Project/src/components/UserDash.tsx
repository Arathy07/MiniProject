import { useNavigate } from "react-router-dom";

const UserDash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:p-10 p-2">
      <h2 className="text-2xl font-bold mb-4">Features</h2>
      <div className="border p-4 rounded-md bg-white mb-4 flex gap-8">
        <button
          onClick={() => navigate("/estimateitems")}
          className="bg-indigo-600 text-white px-3 py-1"
        >
          Items Estimate
        </button>
        <button
          onClick={() => navigate("/estimateaverage")}
          className="bg-indigo-600 text-white px-3 py-1"
        >
          Average Estimate
        </button>
      </div>
    </div>
  );
};

export default UserDash;
