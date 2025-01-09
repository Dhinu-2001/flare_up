import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosconfig";
import { store } from "../redux/Store";
import { useParams } from "react-router-dom";

export const UserDetailsDataContext = createContext();

function UserDetailsDataProvider({ children }) {
  const { user_id } = useParams();
  const numericUserId = Number(user_id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/${numericUserId}/`);
      console.log("context", response);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  return (
    <UserDetailsDataContext.Provider
      value={{ data, error, loading, refreshData }}
    >
      {children}
    </UserDetailsDataContext.Provider>
  );
}

export default UserDetailsDataProvider;
