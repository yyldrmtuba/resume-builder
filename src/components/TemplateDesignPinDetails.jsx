import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetail } from "../api";
import MainSpinner from "./MainSpinner";
import { HiOutlineFolderAdd } from "react-icons/hi";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence, motion } from "framer-motion";
import TemplateDesignPin from "./TemplateDesignPin";
import { FaHouse } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderOpen,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import { saveToCollections, saveToFavourites } from "../utils/helpers";

const TemplateDesignPinDetails = () => {
  const { templateId } = useParams();

  const {
    data,
    isLoading,
    isError,
    refetch: template_refetch,
  } = useQuery(["template", templateId], () => getTemplateDetail(templateId));
  const { data: templates, refetch: templates_refetch } = useTemplates();
  const { data: user, refetch: user_refetch } = useUser();

  const addToCollection = async () => {
    await saveToCollections(user, data);
    user_refetch();
    template_refetch();
  };

  const addToFavourite = async () => {
    await saveToFavourites(user, data);
    templates_refetch();
    template_refetch();
  };

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error While fetching the data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* bread crump */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>
      {/* design */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          <img
            src={data?.imageURL}
            className="w-full h-auto object-contain rounded-md"
            alt=""
          />

          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-base font-semibold text-txtPrimary">
                {data?.title}
              </p>

              <div className="flex items-center justify-center gap-1">
                <BiHeart className="text-base text-red-500" />
                <p>{data?.favourites?.length} likes</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <div
                    onClick={addToCollection}
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <BiSolidFolderPlus className="text-base text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Remove From Collection
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={addToCollection}
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <BiFolderPlus className="text-base text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Add to collection
                    </p>
                  </div>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <div
                    onClick={addToFavourite}
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <BiSolidHeart className="text-base text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Remove From Favourites
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={addToFavourite}
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <BiHeart className="text-base text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Add to Favourites
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4 w-full flex-col flex items-center justify-start px-3 gap-6">
          <div
            className="w-full h-72 bg-blue-400 rounded-md overflow-hidden  relative"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2023/10/04/03/04/ai-generated-8292699_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border border-gray-50 text-white "
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit the template */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateId=${templateId}`}
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer"
            >
              <p className="text-white font-semibold text-lg">
                Edit this template
              </p>
            </Link>
          )}

          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            <AnimatePresence>
              {data?.tags?.map((tag, index) => (
                <motion.p
                  className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                  key={index}
                >
                  {tag}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* similar post */}
      <div className="py-6 w-full flex flex-col items-start justify-start gap-4">
        <p className="text-lg font-semibold text-txtDark">
          You might also like
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
          <React.Fragment>
            <AnimatePresence>
              {templates
                ?.filter((temp) => temp._id !== data?._id)
                .slice(0, 9)
                .map((template, index) => (
                  <TemplateDesignPin
                    key={template?._id}
                    data={template}
                    index={index}
                  />
                ))}
            </AnimatePresence>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesignPinDetails;
