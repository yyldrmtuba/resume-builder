import React, { useState } from "react";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDown } from "../animations";

const Filters = () => {
  const [isHovered, setIsHovered] = useState(false);

  const { data: filterData, isLoading, isError } = useFilters();
  const queryClient = useQueryClient();

  const handleFilteredValue = (value) => {
    // const previousData = queryClient.getQueryData("globalFilter");
    // const updatedData = { ...previousData, filter: value };
    // queryClient.setQueryData("globalFilter", updatedData);

    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };

  const clearAllFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <div className="w-full flex items-center justify-start py-4">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={clearAllFilter}
        className="border border-gray-300 mr-2 rounded-md px-3 py-2 cursor-pointer group hover:shadow-md bg-gray-200 shadow-md relative"
      >
        <MdLayersClear className="text-xl" />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...slideUpDown}
              className="absolute -top-8 -left-2 px-2 py-1 bg-white rounded-md shadow-md"
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((data) => (
            <div
              onClick={() => handleFilteredValue(data.value)}
              key={data.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${
                filterData.searchTerm === data.value && "bg-gray-200 shadow-md"
              }`}
            >
              <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {data.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
