/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { adminIds, initialTags } from "../utils/helpers";
import useTemplates from "../hooks/useTemplates";
import { PuffLoader } from "react-spinners";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { FaTrash, FaUpload } from "react-icons/fa6";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

const CreateTemplate = () => {
  const { data, isLoading, isError } = useUser();
  const {
    data: templates,
    isLoading: t_isLoading,
    isError: t_isError,
    refetch,
  } = useTemplates();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    imgUrl: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    // Check if the tag is already selected
    if (selectedTags.includes(tag)) {
      // If selected, remove it
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      // If not selected, add it
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the corresponding property in the state object
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const pushTemplateData = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.imageURL,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timeStamp: timeStamp,
    };
    console.log(_doc);

    setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({
          ...prevData,
          title: "",
          imgUrl: null,
        }));
        setImageAsset((prevAsset) => ({ ...prevAsset, imageURL: null }));
        setSelectedTags([]);
        refetch();
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  // file upload
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prevAsset) => ({
            ...prevAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error("Error Authorization revoked");
          } else {
            toast.warning("Something went wrong please try again later");
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prevAsset) => ({
              ...prevAsset,
              imageURL: downloadURL,
            }));

            toast.success("File uploaded to server");
            setInterval(() => {
              setImageAsset((prevAsset) => ({
                ...prevAsset,
                isImageLoading: false,
              }));
            }, 2000);
          });
        }
      );
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // delete an image
  const deleteImageObject = () => {
    const deleteRef = ref(storage, imageAsset.imageURL);
    deleteObject(deleteRef).then(() => {
      toast.success("Image removed from the cloud");
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        imageURL: null,
      }));
    });
  };

  // delete the template
  const removeTemplate = async (template) => {
    console.log(template);
    const deleteRef = ref(storage, template.imageURL);
    await deleteObject(deleteRef).then(() => {
      toast.success("Image removed from the cloud");
    });

    await deleteDoc(doc(db, "templates", template._id))
      .then(() => {
        toast.success("Template removed");
        refetch();
      })
      .catch((error) => {
        toast.error("Something went wrong try again later");
      });
  };

  useEffect(() => {
    if (!isLoading && !adminIds.includes(data?.uid)) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data, navigate]);

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      <div className="w-full flex-1 flex flex-col items-center justify-start gap-4 px-2 col-span-12 lg:col-span-4 2xl:col-span-3">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>
        {/* title */}

        {t_isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <div className="w-full flex items-center justify-end">
            <p className="text-base text-txtLight uppercase font-semibold">
              TempId :{" "}
            </p>
            <p className="text-sm text-txtDark font-bold tracking-wider">
              {templates && templates.length > 0
                ? `Template${templates.length + 1}`
                : "Template1"}
            </p>
          </div>
        )}

        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          value={formData.title}
          placeholder="Template Title"
          onChange={handleInputChange}
        />

        {/* file upload */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <PuffLoader color="#498FCD" size={40} />
              <p>{imageAsset.progress.toFixed(2)}%</p>
            </div>
          ) : (
            <>
              {!imageAsset.imageURL ? (
                <React.Fragment>
                  <label className=" w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p className="font-bold text-2xl">
                          <FaUpload />
                        </p>
                        <p className="text-lg">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img
                    src={imageAsset.imageURL}
                    alt="uploaded_img"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div
                    className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                    onClick={deleteImageObject}
                  >
                    <FaTrash className="text-sm text-white" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* tags */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag) => (
            <div
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={` border  border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        <button
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushTemplateData}
        >
          Save
        </button>
      </div>
      <div className="px-2 w-full flex-1 py-4 col-span-12 lg:col-span-8 2xl:col-span-9">
        {t_isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <PuffLoader color="#498FCD" size={40} />
          </div>
        ) : (
          <>
            {templates && templates?.length > 0 ? (
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                {templates?.map((template) => (
                  <div
                    key={template._id}
                    className="w-full h-[500px] rounded-md overflow-hidden relative"
                  >
                    <img
                      src={template.imageURL}
                      className="w-full h-full object-cover"
                      alt=""
                    />

                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={() => removeTemplate(template)}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                <PuffLoader color="#498FCD" size={40} />
                <p className="text-xl tracking-wider capitalize text-txtPrimary">
                  No data
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
