import { createContext, useContext, useEffect, useState } from "react";
import { AccountInfoType, severityType, snackMessageType } from "../types/api";
import { useQuery } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuthStateContext } from "./AuthContextProvider";

type stateContextProps = {
  snackMessage: snackMessageType;
  handleSnackMessage: (message: string, severity: severityType) => void;
  isSnackOpen: boolean;
  handleCloseSnack: () => void;
  handleOpenSnack: () => void;
  AccountInfo : AccountInfoType;
  openSideDrawer : boolean;
  handleCloseSideDrawer : () => void;
  handleOpenSideDrawer : () => void;

};

type ContextProviderProps = {
  children: React.ReactNode;
};

const StateContext = createContext<stateContextProps | null>(null);

const StateContextProvider = ({ children }: ContextProviderProps) => {
  const { auth } = useAuthStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [snackMessage, setSnackMessage] = useState<snackMessageType>({
    message: "",
    severity: "success",
  });
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [openSideDrawer, setOpenSideDrawer] = useState(false)

  const { data: AccountInfo, refetch: refetchAccountInfo } = useQuery({
    queryKey: ["accountInfo"],
    queryFn: () =>
      axiosPrivate
        .get<AccountInfoType>("/account-info")
        .then((res: any) => res.data),
  });
  
  const handleCloseSnack = () => {
    setIsSnackOpen(false);
  };
  const handleOpenSnack = () => {
    setIsSnackOpen(true);
  };

  const handleSnackMessage = (message: string, severity: severityType) => {
    setIsSnackOpen(true);
    setSnackMessage({
      message: message,
      severity: severity,
    });
  };

  const handleOpenSideDrawer = () => {
    setOpenSideDrawer(true)
  }

  const handleCloseSideDrawer = () => {
    setOpenSideDrawer(false)
  }
  useEffect(() => {
    refetchAccountInfo();
  }, [auth]);

  return (
    <StateContext.Provider
      value={{
        snackMessage,
        handleSnackMessage,
        isSnackOpen,
        handleCloseSnack,
        handleOpenSnack,
        AccountInfo, 
        openSideDrawer, 
        handleCloseSideDrawer, 
        handleOpenSideDrawer
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

function useStateContext() {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error("useStateContext must be used within a StateContextProvider");
}
export { StateContextProvider, useStateContext };
