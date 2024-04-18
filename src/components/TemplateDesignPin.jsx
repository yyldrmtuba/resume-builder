import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FadeInOutWithOpacityAlone, scaleINOut } from "../animations";
import { AnimatePresence, motion } from "framer-motion";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { toast } from "react-toastify";
import useTemplates from "../hooks/useTemplates";
import { saveToCollections, saveToFavourites } from "../utils/helpers";

const TemplateDesignPin = ({ data, index }) => {
  const [isHoverred, setIsHoverred] = useState(false);
  const { data: user, refetch: user_refetch } = useUser();
  const { refetch: templates_refetch } = useTemplates();
  const navigate = useNavigate();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    user_refetch();
  };

  const addToFavourite = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templates_refetch();
  };

  const handleRouteNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };

  return (
    <motion.div {...scaleINOut(index)}>
      <div
        onMouseEnter={() => setIsHoverred(true)}
        onMouseLeave={() => setIsHoverred(false)}
        className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative"
      >
        <img
          src={data?.imageURL}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <AnimatePresence>
          {isHoverred && (
            <motion.div
              {...FadeInOutWithOpacityAlone}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)]  flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
              onClick={handleRouteNavigation}
            >
              <div className="flex flex-col items-end justify-start w-full gap-8 ">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added To Collection"
                      : "Add To Collection"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />

                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added To Favourites"
                      : "Add To Favourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavourite}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [boxHovered, setBoxHovered] = useState(false);

  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={() => setBoxHovered(true)}
      onMouseLeave={() => setBoxHovered(false)}
    >
      <Icon className="text-txtPrimary text-base" />

      <AnimatePresence>
        {boxHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
