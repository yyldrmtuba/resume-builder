import React from "react";
import { useQuery } from "react-query";

const useFilters = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "globalFilter",
    () => ({ searchTerm: "" }), // Use a function to return the initial data
    { refetchOnWindowFocus: false }
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useFilters;
