import { useModal } from "@/context/modals";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./../../firebase";
import toast from "react-hot-toast";

export default function AddClient({ client }) {
  const { toggleAddClient } = useModal();
  const [loading, setLoading] = useState();
  const [details, setDetails] = useState({
    emailAddress: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (client) {
      setDetails({
        emailAddress: client?.emailAddress,
        phoneNumber: client?.phoneNumber,
        firstName: client?.firstName,
        lastName: client?.lastName,
      });
    } else {
      setDetails({
        emailAddress: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
      });
    }
  }, [client]);
  async function onAddClient() {
    setLoading(true);
    const clientsCollectionRef = collection(db, "clients");
    const q = query(
      clientsCollectionRef,
      where("emailAddress", "==", details.emailAddress.toLowerCase()),
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Client does not exist, add them
        await addDoc(clientsCollectionRef, {
          ...details,
          emailAddress: details.emailAddress.toLowerCase(),
          createdAt: serverTimestamp(),
        });
        toast.success("Client added successfully");
      } else {
        // Client already exists
        toast.error("Client already exists");
      }
    } catch (error) {
      console.error("Error adding client: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateClient() {
    setLoading(true);
    try {
      const docRef = doc(db, "clients", client?.id);
      await updateDoc(docRef, {
        ...details,
        updatedAt: serverTimestamp(),
      });
      toast.success(`Enquiry successfully closed.`);
      toggleAddClient(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/50 backdrop-blur-md flex overflow-hidden">
      <div className="w-2/3 items-center justify-center flex flex-col space-y-5 bg-white">
        <div className="flex flex-col relative w-3/4">
          <div className="flex flex-col space-y-2 ">
            <p className="text-3xl font-bold">Registering a new Client</p>
            <p className="text-gray-500 text-sm">Fill the form to continue</p>
          </div>
          <div className="pt-10 flex flex-col space-y-10">
            <div className="flex items-center space-x-3">
              <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-2/4 relative">
                <input
                  value={details.firstName}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  id="firstName"
                  className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/firstName"
                  type="text"
                  placeholder="Store ID"
                />

                <label
                  htmlFor="firstName"
                  className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/firstName:text-xs peer-focus/firstName:-translate-y-5 ease-linear peer-placeholder-shown/firstName:translate-y-0 peer-placeholder-shown/firstName:text-base peer-placeholder-shown/firstName:text-gray-500 "
                >
                  First name
                </label>
              </div>
              <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-2/4 relative">
                <input
                  value={details.lastName}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  id="lastName"
                  className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/lastName"
                  type="text"
                  placeholder="Store ID"
                />

                <label
                  htmlFor="lastName"
                  className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/lastName:text-xs peer-focus/lastName:-translate-y-5 ease-linear peer-placeholder-shown/lastName:translate-y-0 peer-placeholder-shown/lastName:text-base peer-placeholder-shown/lastName:text-gray-500 "
                >
                  Last name
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-2/4 relative">
                <input
                  value={details.emailAddress}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      emailAddress: e.target.value,
                    }))
                  }
                  id="email"
                  className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/email"
                  type="email"
                  placeholder="Store ID"
                />

                <label
                  htmlFor="email"
                  className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/email:text-xs peer-focus/email:-translate-y-5 ease-linear peer-placeholder-shown/email:translate-y-0 peer-placeholder-shown/email:text-base peer-placeholder-shown/email:text-gray-500 "
                >
                  Email address
                </label>
              </div>
              <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-2/4 relative">
                <input
                  value={details.phoneNumber}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  id="phoneNumber"
                  className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/phoneNumber"
                  type="phone"
                  placeholder="Store ID"
                />

                <label
                  htmlFor="phoneNumber"
                  className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/phoneNumber:text-xs peer-focus/phoneNumber:-translate-y-5 ease-linear peer-placeholder-shown/phoneNumber:translate-y-0 peer-placeholder-shown/phoneNumber:text-base peer-placeholder-shown/phoneNumber:text-gray-500 "
                >
                  Phone number
                </label>
              </div>
            </div>

            <div className="flex flex-row items-center space-x-10">
              <button
                disabled={loading}
                onClick={() => {
                  if (client) {
                    onUpdateClient();
                  } else {
                    onAddClient();
                  }
                }}
                className="bg-yellow-500 flex items-center justify-center px-5 py-4 rounded-md font-medium text-white w-52"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  " Add Client"
                )}
              </button>
              <button
                onClick={() => toggleAddClient(false)}
                className="text-gray-500 leading-relaxed"
              >
                Get back
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex-1 bg-cover bg-center object-cover"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1616166358812-784a766b5762?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      ></div>
    </div>
  );
}
