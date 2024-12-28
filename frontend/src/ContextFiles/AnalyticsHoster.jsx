import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosconfig";
import { store } from "../redux/Store";
import { useParams } from "react-router-dom";

export const AnalyticsHosterDataContext = createContext();

function AnalyticsHosterProvider({ children }) {
  const state = store.getState();
  const hoster_id = state.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/events/analytics/${hoster_id}/`
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
  }, [hoster_id]);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  return (
    <AnalyticsHosterDataContext.Provider
      value={{ data, error, loading, refreshData, setLoading }}
    >
      {children}
    </AnalyticsHosterDataContext.Provider>
  );
}

export default AnalyticsHosterProvider;
