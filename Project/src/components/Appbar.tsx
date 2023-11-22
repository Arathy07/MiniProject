import BuildProLogo from "../assets/BrickLogo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/api";

const Appbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="w-full flex items-center justify-between p-10">
        <Link
          to={"/user"}
          className="flex items-center text-black no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
        >
          <img
            src={BuildProLogo}
            className="h-9 fill-current text-indigo-600 pr-2"
          />
          <span className=" text-black">BuildPro</span>
        </Link>
        <div
          className="flex w-1/2 justify-end content-center cursor-pointer text-blue-500 hover:text-blue-700"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </>
  );
};

export default Appbar;
