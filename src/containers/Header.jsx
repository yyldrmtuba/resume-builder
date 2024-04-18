import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWithOpacityAlone, slideUpDownDropMenu } from "../animations";
import useUser from "../hooks/useUser";
import { PuffLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { auth } from "../config/firebase.config";
import useFilters from "../hooks/useFilters";
import { adminIds } from "../utils/helpers";

const Header = () => {
  const [isMenu, setIsMenu] = useState(false);

  const { data, isLoading, isError } = useUser();
  const { data: gbl_SearchData } = useFilters();

  const queryClient = useQueryClient();

  const signOut = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    const newSearchTerm = e.target.value;

    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: newSearchTerm,
    });
  };

  const clearFiler = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      <Link to={"/"}>
        <img src={Logo} className="w-12 h-auto object-contain" alt="" />
      </Link>

      {/* search box */}
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          type="text"
          placeholder="Search here.."
          value={gbl_SearchData?.searchTerm ? gbl_SearchData?.searchTerm : ""}
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
          onChange={handleSearchTerm}
        />
        <AnimatePresence>
          {gbl_SearchData?.searchTerm.length > 0 && (
            <motion.div
              {...FadeInOutWithOpacityAlone}
              onClick={clearFiler}
              className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className="text-2xl text-black">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* profile */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <>
            {data ? (
              <motion.div
                {...FadeInOutWithOpacityAlone}
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer ">
                    <img
                      className="w-full h-full object-cover rounded-md"
                      referrerPolicy="no-referrer"
                      src={data?.photoURL}
                    />

                    {/* drop menu */}
                    <AnimatePresence>
                      {isMenu && (
                        <motion.div
                          {...slideUpDownDropMenu}
                          onMouseLeave={() => setIsMenu(false)}
                          className="px-4 py-3 rounded-md bg-white shadow-md absolute right-0 top-10 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                        >
                          {data?.photoURL ? (
                            <div className="flex flex-col items-center justify-center gap-3">
                              <img
                                className="w-20 h-20 object-cover rounded-full shadow-md"
                                referrerPolicy="no-referrer"
                                src={data?.photoURL}
                              />
                              <p className="text-lg  tracking-wider text-txtPrimary">
                                {data?.displayName}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md">
                                <p className="text-lg text-white">
                                  {data?.displayName[0]}
                                </p>
                              </div>
                              <p className="text-lg  tracking-wider text-txtPrimary">
                                {data?.displayName}
                              </p>
                            </div>
                          )}

                          {/* menus */}
                          <div className="w-full flex-col items-start flex gap-8 pt-6">
                            <Link
                              onClick={() => setIsMenu(!isMenu)}
                              to={`/profile/${data?.uid}`}
                              className="text-txtLight hover:text-txtDark"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              My Account
                            </Link>

                            {adminIds.includes(data?.uid) && (
                              <Link
                                onClick={() => setIsMenu(!isMenu)}
                                to="/template/create"
                                className="text-txtLight hover:text-txtDark"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Add New Template
                              </Link>
                            )}

                            <div
                              className=" w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group"
                              onClick={signOut}
                            >
                              <p className="text-txtLight group-hover:text-txtDark">
                                Sign-Out
                              </p>
                              <HiLogout className="group-hover:text-txtDark text-txtLight" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* dropmenu ends */}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700">
                    <p className="text-lg text-white">{data?.displayName[0]}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <Link to="/auth">
                <motion.button
                  {...FadeInOutWithOpacityAlone}
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
