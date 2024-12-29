import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosconfig";
import { store } from "../redux/Store";

export const AnalyticsAdminDataContext = createContext();

function AnalyticsAdminProvider({ children }) {
  const state = store.getState();
  const admin_id = state.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/events/analytics_admin/${admin_id}/`
      );
      console.log("context", response);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [admin_id]);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  return (
    <AnalyticsAdminDataContext.Provider
      value={{ data, error, loading, refreshData, setLoading }}
    >
      {children}
    </AnalyticsAdminDataContext.Provider>
  );
}

export default AnalyticsAdminProvider;
