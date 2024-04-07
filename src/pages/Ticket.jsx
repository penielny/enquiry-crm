import { db } from "./../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DisplayText } from "./Enquiry";
import moment from "moment";
export default function Ticket() {
  const [loading, setLoading] = useState(false);
  const [enquiry, setEnquiry] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  let { id } = useParams();

  const fetchEnquiryById = async () => {
    if (!id) return;
    setLoading(true);
    const docRef = doc(db, "enquiry", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return setEnquiry({ ...docSnap.data(), id: docSnap.id });
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  async function addExchangeDocument() {
    if (message === "" || message === " ")
      return toast.error(`Please enter a message.`);
    setLoading(true);
    try {
      const enquiresCollectionRef = collection(db, "exchanges");
      await addDoc(enquiresCollectionRef, {
        sender: "",
        message: message,
        enuiryId: id,
        createdAt: serverTimestamp(),
      });
      toast.success("Client enquiry successfully logged.");
      createNotification();
      setMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createNotification() {
    if (message === "" || message === " ")
      return toast.error(`Please enter a message.`);
    try {
      const enquiresCollectionRef = collection(db, "notifications");
      await addDoc(enquiresCollectionRef, {
        enquiry,
        message: message,
        enuiryId: id,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (!enquiry) return;
    // Create a query against the collection.
    const q = query(
      collection(db, "exchanges"),
      where("enuiryId", "==", id),
      orderBy("createdAt", "asc"),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messagesData);
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, [enquiry]);
  console.log(messages);
  useEffect(() => {
    fetchEnquiryById();
  }, [id]);

  useEffect(() => {
    // scrool to the end
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" conatainer flex h-screen w-screen mx-auto flex-col items-center flex-1 pt-10 space-y-5">
      <Link to="/dashboard">
        <img
          className="h-20"
          src={"https://www.phdc.gov.gh/img/logo/phdc-logo-simple.svg"}
        />
      </Link>
      <div className="md:w-2/4 flex-1 flex flex-col relative rounded-md bg-gray-50">
        <div className="p-5 border-b flex items-center space-x-5">
          <div className=" p-3 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-green-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-700 leading-relaxed">
              {enquiry?.subject}
            </h3>
            <p className="text-sm font-medium text-yellow-600 pb-2">
              Pee Tex{" "}
              <span
                className={"text-sm text-gray-600 leading-relaxed"}
              >{`${" penielnyinaku@gmail.com "}`}</span>
            </p>
          </div>
        </div>
        <div className="flex-1 p-5 flex-col space-y-5 overflow-y-auto ">
          {messages?.map((data, index) => {
            if (data.sender === "") {
              return (
                <>
                  {/* me bubble */}
                  <div className="flex items-center justify-center space-x-5 mx-auto w-5/6 ">
                    <div className="border-b border-gray-100 flex-1"></div>{" "}
                    <p className="text-sm leading-relaxed">
                      {moment(data?.createdAt?.toDate()).format("LLL")}
                    </p>
                    <div className="border-b border-gray-100 flex-1"></div>
                  </div>
                  <div className="flex space-x-3 items-end justify-end ">
                    <div className="w-4/5  leading-relaxed rounded-md px-5 py-4 bg-white border text-gray-500">
                      <DisplayText text={data.message} />
                    </div>
                    <img
                      className="h-10 w-10 border border-gray-100 rounded-full"
                      src={`https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg`}
                    />
                  </div>
                </>
              );
            }
            return (
              <>
                <div className="flex items-center justify-center space-x-5 mx-auto w-5/6 ">
                  <div className="border-b border-gray-100 flex-1"></div>{" "}
                  <p className="text-sm leading-relaxed">
                    {moment(data?.createdAt?.toDate()).format("LLL")}
                  </p>
                  <div className="border-b border-gray-100 flex-1"></div>
                </div>
                <div className="flex space-x-3 items-end">
                  <img
                    className="h-10 w-10 border border-gray-100 rounded-full"
                    src={`https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg`}
                  />
                  <div className="w-4/5  leading-relaxed rounded-md px-5 py-4 bg-gray-100">
                    <DisplayText text={data.message} />
                  </div>
                </div>
              </>
            );
          })}
          <div ref={messagesEndRef} />
          <div className="pb-32" />
        </div>
        <div className="absolute left-0 right-0 bottom-0 bg-gray-50/20 backdrop-blur-sm flex flex-col md:flex-row space-y-2 md:space-y-0 w-full md:space-x-3 pt-5 md:items-end p-5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border flex-1 rounded-full resize-none min-h-5 px-5 placeholder:pt-3 overflow-hidden"
            placeholder="message ..."
          />
          <button
            disabled={loading}
            onClick={() => addExchangeDocument()}
            className=" bg-green-600 text-gray-100 p-3 flex items-center justify-center shrink-0 rounded-full text-sm px-5"
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
              "Send Response"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
