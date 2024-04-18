/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesignPin } from "../components";
import useTemplates from "../hooks/useTemplates";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import { NoData } from "../assets";

const UserProfile = () => {
  const { data: user } = useUser();
  const { uid } = useParams();
  const [activeTab, setActiveTab] = useState("resumes");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
  } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid) || []
  );

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-500">
        <img
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <img
              src={user?.photoURL}
              className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
              alt=""
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <img
              src={
                "https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-499.jpg"
              }
              className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
              alt=""
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>

        <div className="flex items-center justify-center mt-12">
          <div
            onClick={() => {
              setActiveTab("resumes");
            }}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer  `}
          >
            <p
              className={`text-base text-txtPrimary  group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white shadow-md text-blue-600"
              }`}
            >
              My Resumes
            </p>
          </div>
          <div
            onClick={() => {
              setActiveTab("collections");
            }}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer `}
          >
            <p
              className={`text-base text-txtPrimary  group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 && user?.collections ? (
                  <RenderTemplete
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}

            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes && savedResumes?.length > 0 ? (
                  <RenderTemplete templates={savedResumes} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No Saved Resumes</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RenderTemplete = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
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
      )}
    </React.Fragment>
  );
};

export default UserProfile;
