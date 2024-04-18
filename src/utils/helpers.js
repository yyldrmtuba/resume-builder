import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Template1, Template2, Template3, Template4, Template5 } from "../designs";
import { toast } from "react-toastify";
import { db } from "../config/firebase.config";

export const FiltersData = [
  { id: "1", label: "Software Engineer", value: "Software Engineer" },
  { id: "2", label: "Front-end Developer", value: "Front-end Developer" },
  { id: "3", label: "Back-end Developer", value: "Back-end Developer" },
  { id: "4", label: "Full-stack Developer", value: "Full-stack Developer" },
  { id: "5", label: "Web Developer", value: "Web Developer" },
  { id: "6", label: "UI/UX Designer", value: "UI/UX Designer" },
  { id: "7", label: "Graphic Designer", value: "Graphic Designer" },
  { id: "8", label: "Data Scientist", value: "Data Scientist" },
  { id: "9", label: "Product Manager", value: "Product Manager" },
  { id: "10", label: "Project Manager", value: "Project Manager" },
  { id: "11", label: "Business Analyst", value: "Business Analyst" },
  { id: "12", label: "Marketing Manager", value: "Marketing Manager" },
  { id: "13", label: "Sales Representative", value: "Sales Representative" },
  {
    id: "14",
    label: "Customer Service Representative",
    value: "customer_service_representative",
  },
  { id: "15", label: "HR Manager", value: "hr_manager" },
  { id: "16", label: "Financial Analyst", value: "financial_analyst" },
  { id: "17", label: "Content Writer", value: "content_writer" },
  { id: "18", label: "Teacher/Educator", value: "teacher_educator" },
  {
    id: "19",
    label: "Healthcare Professional",
    value: "healthcare_professional",
  },
  { id: "20", label: "Legal Counsel", value: "legal_counsel" },
];

export const TemplatesData = [
  { id: `template1-${Date.now()}`, name: "Template1", component: Template1 },
  { id: `template2-${Date.now()}`, name: "Template2", component: Template2 },
  { id: `template3-${Date.now()}`, name: "Template3", component: Template3 },
  { id: `template4-${Date.now()}`, name: "Template4", component: Template4 },
  { id: `template5-${Date.now()}`, name: "Template5", component: Template5 },
];

export const adminIds = ['103882984256420003622', '118855140']; // manually add your admin ids here from firebase

export const initialTags = [
  "Software Engineer",
  "Front-end Developer",
  "Back-end Developer",
  "Full-stack Developer",
  "Web Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Data Scientist",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Marketing Manager",
  "Sales Representative",
  "Customer Service Representative",
  "HR Manager",
  "Financial Analyst",
  "Content Writer",
  "Teacher/Educator",
  "Healthcare Professional",
  "Legal Counsel",
];

export const saveToCollections = async (user, data, fetch) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayUnion(data?._id),
    })
      .then(() => {
        toast.success("Added to collections successfully");
      })
      .catch((error) => {
        toast.error("Something Went Wrong Try again later..");
      });
  } else {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayRemove(data?._id),
    })
      .then(() => {
        toast.success("Removed from collections successfully");
      })
      .catch((error) => {
        toast.error("Something Went Wrong Try again later..");
      });
  }
};

export const saveToFavourites = async (user, data) => {
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayUnion(user?.uid),
    })
      .then(() => {
        toast.success("Added to favorites successfully");
      })
      .catch((error) => {
        toast.error("Something Went Wrong Try again later..");
      });
  } else {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayRemove(user?.uid),
    })
      .then(() => {
        toast.success("Removed from favorites successfully");
      })
      .catch((error) => {
        toast.error("Something Went Wrong Try again later..");
      });
  }
};
