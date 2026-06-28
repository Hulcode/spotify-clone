// context/AudioPlayerContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const GetUserContext = createContext();
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
export function GetUserProvider({ children }) {
  const [user, setUser] = useState({});
  async function getUser() {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
      setUser(response.data.user);
    } catch (error) {
      setUser({
        userName: "Unknown User",
        email: "example@gmail.com",
      });
      console.error(error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <GetUserContext.Provider
      value={{
        user,
        getUser,
      }}
    >
      {children}
    </GetUserContext.Provider>
  );
}

export const useGetUser = () => useContext(GetUserContext);
