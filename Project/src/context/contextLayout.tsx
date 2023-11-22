import { Outlet } from "react-router-dom";
import { AppContextProvider } from "./context";
import Appbar from "../components/Appbar";

const AppContextLayout = () => {
  return (
    <AppContextProvider>
      <Appbar />
      <Outlet />
    </AppContextProvider>
  );
};

export default AppContextLayout;
