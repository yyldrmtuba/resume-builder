import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { TemplatesData } from "../utils/helpers";
import { MainSpinner } from "../components";
import useTemplates from "../hooks/useTemplates";
import { FaHouse } from "react-icons/fa6";

const CreateResume = () => {
  const navigate = useNavigate();
  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
  } = useTemplates();

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  if (!templates) {
    return navigate("/", { replace: true });
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-4">
      <Routes>
        {TemplatesData.map((template) => (
          <Route
            key={template.id}
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
