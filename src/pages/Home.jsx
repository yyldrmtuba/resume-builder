import React, { Suspense } from "react";
import { Header } from "../containers";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  CreateResume,
  CreateTemplate,
  HomeTemplates,
  UserProfile,
} from "../pages";
import useUser from "../hooks/useUser";
import { PuffLoader } from "react-spinners";
import { MainSpinner, TemplateDesignPinDetails } from "../components";
import { TemplatesData } from "../utils/helpers";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* header */}
      <Header />
      {/* main container */}
      <main className="w-full">
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeTemplates />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<UserProfile />} />

            <Route path="/resume/*" element={<CreateResume />} />
            <Route
              path="/resumeDetail/:templateId"
              element={<TemplateDesignPinDetails />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
