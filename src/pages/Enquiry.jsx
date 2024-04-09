import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import CreateTicket from "@/components/ConfirmModal";
import ConfirmCloseModal from "@/components/CreateTicket";
export default function Enquiry() {
  const [enquiry, setEnquiry] = useState({});
  const [client, setClient] = useState({});
  const [enquiries, setEnquires] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const navigate = useNavigate();

  function summarizeMessage(message) {
    if (message.length <= 100) return message; // Return the message if it's short
    return message.substring(0, 100) + "..."; // Truncate and add ellipsis
  }

  const fetchEnquiryById = async (enquiryId) => {
    setLoading(true);
    const docRef = doc(db, "enquiry", enquiryId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return setEnquiry({ id: docSnap.id, ...docSnap.data() }); // Or process the data as needed
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

  const fetchClientById = async (clientId) => {
    setLoading(true);
    const docRef = doc(db, "clients", clientId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return setClient(docSnap.data()); // Or process the data as needed
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

  useEffect(() => {
    fetchEnquiryById(id);
  }, [id]);

  useEffect(() => {
    if (enquiry) {
      fetchClientById(enquiry.enuiryId);
    }
  }, [enquiry]);

  useEffect(() => {
    async function getRecentEnquires() {
      if (!enquiry?.emailAddress) return;
      const enquiriesRef = collection(db, "enquiry");

      const q = query(
        enquiriesRef,
        where("emailAddress", "==", enquiry?.emailAddress?.toLowerCase()),
        orderBy("createdAt"),
        limit(5),
      );

      try {
        const querySnapshot = await getDocs(q);
        let enq_ = [];
        querySnapshot.docs.forEach((doc) => {
          enq_.push({ id: doc.id, ...doc.data() });
        });

        setEnquires(enq_);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    }

    if (enquiry) {
      getRecentEnquires();
    }
  }, [enquiry]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-row ">
        <div className="flex-1  h-[90vh] flex flex-col overflow-y-auto ">
          <div className="border-b mx-12 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 flex space-x-5 text-gray-700 flex-row items-center justify-center px-5 py-2 w-fit  font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <p className="leading-relaxed text-yellow-700 uppercase font-medium">
                {id}
              </p>
            </div>
            <div className="flex items-center space-x-5">
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-gray-100 flex text-blue-800 space-x-5 flex-row items-center justify-center px-5 py-2 w-fit  font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </svg>
              </button>
              <button
                disabled={enquiry?.enquiryClosed}
                onClick={() => setShowTickets(true)}
                className="bg-gray-100 flex text-green-800 space-x-5  flex-row items-center justify-center px-5 py-2 w-fit  font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            key={`heading-enquiry`}
            className="h-full bg-white/20 backdrop-blur-lg  p-10 flex-col space-y-5 cursor-pointer"
          >
            <div>
              <p className="text-xl font-semibold leading-relaxed capitalize text-gray-700 mb-3">
                {enquiry?.subject || "Subject - N/A"}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-slate-500 leading-relaxed ">
                  {enquiry?.emailAddress}
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-green-300" />
                <p className="text-sm font-light">
                  {enquiry?.category || "Category - N/A"}
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-green-300" />
                <p className="text-sm font-light">
                  {enquiry?.createdAt
                    ? moment(enquiry?.createdAt.seconds * 1000)
                        .startOf("hour")
                        .fromNow()
                    : "Time not available"}
                </p>
              </div>
            </div>
            {enquiry?.attachment !== "" && (
              <div className="bg-yslate-100 border border-gray-100 min-h-16 rounded flex items-center justify-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
                <p>View Attachment</p>
              </div>
            )}
            <DisplayText text={enquiry?.message} />
            <div className="pb-40" />
          </div>
        </div>
        {/* client information and recent enquires. */}
        <div className="w-2/5 h-[90vh] border-l flex flex-col overflow-y-auto items-center py-10">
          <img
            className="h-48 w-48 rounded-full"
            src={`https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg`}
          />
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-500 leading-relaxed">
              {client.firstName + " "}
              {client.lastName}
            </p>
            <p className="text-md font-light text-gray-500 leading-relaxed">
              {client.emailAddress}
            </p>
            <p className="text-md font-light text-gray-500 leading-relaxed">
              {client.phoneNumber}
            </p>
          </div>
          <div className="flex flex-col space-y-5 w-full p-10">
            <p className="text-lg font-semibold text-gray-600">
              Recent Enquiries
            </p>
            <div className="flex flex-col space-y-3">
              {enquiries.map((data, index) => (
                <Link
                  to={"/dashboard/enquiry/" + data.id}
                  key={`${index}-enquires`}
                  className="bg-white/50 backdrop-blur-sm flex flex-col space-y-3 border-gray-200 rounded-lg min-h-20 border p-5"
                >
                  <p>{data.subject}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-slate-500 leading-relaxed">
                      {enquiry.category}
                    </p>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-300" />
                    <p className="text-sm font-light">
                      {enquiry?.createdAt
                        ? moment(enquiry.createdAt.seconds * 1000)
                            .startOf("hour")
                            .fromNow()
                        : "Time not available"}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {summarizeMessage(data.message)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute bg-black top-0  left-0 bottom-0 right-0 z-50"></div> */}

      {showTickets && (
        <ConfirmCloseModal id={id} close={() => setShowTickets(false)} />
      )}

      {showConfirm && (
        <CreateTicket
          enquiry={enquiry}
          close={() => setShowConfirm(false)}
          id={id}
        />
      )}
    </div>
  );
}

export function DisplayText({ text }) {
  return (
    <div>
      {text?.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
}
