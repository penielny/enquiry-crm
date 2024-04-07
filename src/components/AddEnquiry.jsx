import { useModal } from "@/context/modals";
import { db, firebase_storage } from "./../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import isValidEmail from "@/util/isValidEmail";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
export default function AddEnquiry() {
  const { toggleAddEnquiry } = useModal();
  const [loading, seLoading] = useState();
  const [isNewClient, setIsNewClient] = useState(false);
  const uploadFileInputref = useRef();
  const [isFile, setIsFile] = useState(false);
  const [uploadFile, setUploadFile] = useState();

  const [details, setDetails] = useState({
    emailAddress: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    subject: "",
    category: "",
    message: "",
    attachment: "",
  });

  const onUploadFile = async (file) => {
    if (file) {
      const storageRef = ref(
        firebase_storage,
        `/enquires/${file.name}_${Date.now()}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
        },
        (err) => {
          console.log(err);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDetails((prev) => ({ ...prev, attachment: url }));
          });
        },
      );
    }
  };

  async function onAddClient({
    emailAddress,
    phoneNumber,
    firstName,
    lastName,
  }) {
    try {
      const clientsCollectionRef = collection(db, "clients");
      const snap = await addDoc(clientsCollectionRef, {
        emailAddress: emailAddress.toLowerCase(),
        phoneNumber,
        firstName,
        lastName,
        createdAt: serverTimestamp(),
      });
      toast.success("Client added successfully");
      return snap;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  }

  async function isClientRecordExist({ emailAddress }) {
    console.log(emailAddress, "emailAddress");
    const clientsCollectionRef = collection(db, "clients");
    const q = query(
      clientsCollectionRef,
      where("emailAddress", "==", emailAddress.toLowerCase()),
    );

    try {
      const querySnapshot = await getDocs(q);
      return { isCreated: !querySnapshot.empty, querySnapshot };
    } catch (error) {
      toast.error(error.message);
      return { isCreated: false, message: error.message };
    }
  }

  async function addEnquiryDocument({ enuiryId }) {
    console.log(enuiryId, details);
    try {
      const enquiresCollectionRef = collection(db, "enquiry");
      await addDoc(enquiresCollectionRef, {
        emailAddress: details.emailAddress.toLowerCase(),
        category: details.category,
        message: details.message,
        subject: details.subject,
        attachment: details.attachment,
        enuiryId,
        enquiryClosed: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Client enquiry successfully logged.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function onAddEnquiry() {
    seLoading(true);
    let newUserSnapshot = null;
    try {
      if (details.emailAddress === "" || !isValidEmail(details.emailAddress))
        return toast.error(`please make sure to fill the form`);
      const { isCreated, querySnapshot } = await isClientRecordExist({
        emailAddress: details.emailAddress,
      });
      console.log(isCreated, querySnapshot, "check_user");
      if (!isCreated) {
        if (
          details.firstName === "" ||
          details.lastName === "" ||
          details.phoneNumber === ""
        )
          return toast.error(
            `please fill the client form. this client does not exist in our records`,
          );
        newUserSnapshot = await onAddClient({
          emailAddress: details.emailAddress,
          firstName: details.firstName,
          lastName: details.lastName,
          phoneNumber: details.phoneNumber,
        });

        console.log(newUserSnapshot, "clinet ID");
        toast.success(`Client has been add successfully`);
      }
      // first uplaod image then add to enquiry data
      if (isFile) {
        await onUploadFile(uploadFile);
      }

      console.log(newUserSnapshot, querySnapshot?.docs[0]?.id);
      // add enquiry
      await addEnquiryDocument({
        enuiryId: isCreated ? querySnapshot?.docs[0]?.id : newUserSnapshot?.id,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      seLoading(false);
    }
  }

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/50 backdrop-blur-md flex overflow-hidden">
      <div className="w-2/3 items-center overflow-y-auto py-20 flex flex-col space-y-5 bg-white">
        <div className="flex flex-col relative w-3/5">
          <div className="flex flex-col space-y-3 ">
            <p className="text-3xl font-bold">Logging Enquiry</p>
            <p className="text-gray-500 text-sm">Fill the form to continue</p>
          </div>
          <div className="pt-10 flex flex-col space-y-10">
            <div className="flex items-center space-x-3">
              <input
                value={isNewClient}
                className="p-3 h-6"
                onChange={(e) => setIsNewClient(e.target.checked)}
                type="checkbox"
              />
              <p>This enquiry is from a new client</p>
            </div>
            {!isNewClient && (
              <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-full relative">
                <input
                  value={details.emailAddress}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      emailAddress: e.target.value,
                    }))
                  }
                  id="existEmail"
                  className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/existEmail"
                  type="email"
                  placeholder="Store ID"
                />

                <label
                  htmlFor="existEmail"
                  className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/existEmail:text-xs peer-focus/existEmail:-translate-y-5 ease-linear peer-placeholder-shown/existEmail:translate-y-0 peer-placeholder-shown/existEmail:text-base peer-placeholder-shown/existEmail:text-gray-500 "
                >
                  Email address
                </label>
              </div>
            )}

            {isNewClient && (
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
            )}

            {isNewClient && (
              <div className="flex items-center space-x-3">
                <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-2/4 relative">
                  <input
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
            )}
            <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-full relative">
              <input
                value={details.subject}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                id="subject"
                className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/subject"
                type="text"
                placeholder="Subject"
              />

              <label
                htmlFor="subject"
                className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/subject:text-xs peer-focus/subject:-translate-y-5 ease-linear peer-placeholder-shown/subject:translate-y-0 peer-placeholder-shown/subject:text-base peer-placeholder-shown/subject:text-gray-500 "
              >
                Enquiry Subject
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <p>Enquiry Category</p>
              <select
                value={details.category}
                defaultValue={"tech"}
                onChange={(e) => {
                  setDetails((prev) => ({ ...prev, category: e.target.value }));
                }}
                className="border outline-none p-3 rounded-md"
              >
                <option value={"tech"}>Web service and Online services</option>
                <option value={"investments"}>Investments</option>
                <option value={"general"}>General</option>
                <option value={"special"}>Special</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <p>Enquiry message</p>
                <div className="flex flex-row items-center space-x-5 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => setIsFile(false)}
                    className={
                      !isFile
                        ? "bg-gray-200/50 px-5 py-1 rounded text-green-600 transition-all"
                        : "transition-all"
                    }
                  >
                    Text
                  </button>
                  <button
                    className={
                      isFile
                        ? "bg-gray-200/50 px-5 py-1 rounded text-green-600 transition-all"
                        : "transition-all"
                    }
                    onClick={() => setIsFile(true)}
                  >
                    File
                  </button>
                </div>
              </div>
              {!isFile && (
                <textarea
                  value={details.message}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="border rounded-md resize-none h-48 p-5"
                ></textarea>
              )}
              {isFile && (
                <div
                  onClick={() => uploadFileInputref.current.click()}
                  className="border border-dashed h-20 flex items-center justify-center"
                >
                  <p className="text-sm text-gray-600">
                    {uploadFile?.name || "Click to upload file"}
                  </p>
                  <input
                    ref={uploadFileInputref}
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    type="file"
                    accept=".doc,.png,.docx,.pages"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row items-center space-x-10">
              <button
                disabled={loading}
                onClick={onAddEnquiry}
                className="bg-yellow-500 px-5 py-4  flex items-center justify-center rounded-md font-medium text-white w-52"
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
                  "Add Enquiry"
                )}
              </button>
              <button
                onClick={() => toggleAddEnquiry(false)}
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
          backgroundImage: `url(https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      ></div>
    </div>
  );
}
