import React, { useCallback, useEffect, useState } from "react";
import { Filters, MainSpinner, TemplateDesignPin } from "../components";
import { TemplatesData } from "../utils/helpers";
import { Link } from "react-router-dom";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import useFilters from "../hooks/useFilters";

const HomeTemplates = () => {
  const [filtererData, setfiltererData] = useState([]);

  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
  } = useTemplates();

  const { data: gbl_SearchData } = useFilters();

  const filterTemplates = useCallback(() => {
    if (!gbl_SearchData?.searchTerm) {
      // If the search term is empty, set the filtered data to the entire templates array
      setfiltererData(templates);
    } else {
      const filtered = templates?.filter((template) => {
        const matchingTags = template.tags.filter((tag) =>
          Array.from(gbl_SearchData.searchTerm).every((letter) =>
            tag.toLowerCase().includes(letter.toLowerCase())
          )
        );

        // Include templates that have matching tags
        return matchingTags.length > 0;
      });

      setfiltererData(filtered);
    }
  }, [templates, gbl_SearchData?.searchTerm]);

  useEffect(() => {
    filterTemplates();
  }, [templates, gbl_SearchData?.filter, gbl_SearchData?.searchTerm]);

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      <Filters />

      {temp_isError ? (
        <React.Fragment>
          <p>Something went wrong please try again later</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <RenderTemplete templates={filtererData} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const RenderTemplete = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates?.map((template, index) => (
              <TemplateDesignPin
                key={template?._id}
                data={template}
                index={index}
              />
            ))}
          </AnimatePresence>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>No Data found</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeTemplates;
