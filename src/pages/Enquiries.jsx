import { db } from "./../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Enquiries() {
  const [tab, setTab] = useState(0);
  const [tabCount, setTabCount] = useState({ open: 0, closed: 0 });

  const [enquiries, setEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Create a query against the collection.
    const q = query(
      collection(db, "enquiry"),
      where("enquiryClosed", "==", tab === 1 ? true : false),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const enquiriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnquiries(enquiriesData);
      if (tab === 1) {
        setTabCount((prev) => ({ ...prev, closed: enquiriesData.length }));
      } else {
        setTabCount((prev) => ({ ...prev, open: enquiriesData.length }));
      }
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, [tab]);

  function summarizeMessage(message) {
    if (message.length <= 100) return message; // Return the message if it's short
    return message.substring(0, 100) + "..."; // Truncate and add ellipsis
  }
  const filteredQueries = enquiries.filter(
    (client) =>
      client?.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className=" flex flex-col space-y-10 overflow-y-auto">
      <div className="flex flex-col">
        {/* seach component */}
        <div className="container mx-auto flex flex-col space-y-10 pt-10">
          <div>
            <h3 className="text-5xl font-medium leading-relaxed text-gray-700">
              Hello, Peniel
            </h3>
            <p className="text-base leading-relaxed text-slate-500">
              There are {enquiries.length} enquires made.
            </p>
          </div>
          <div className="border flex items-center bg-white shadow-sm sticky top-0 ">
            <div className="flex flex-1 px-5">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            <div className="h-full flex space-x-5 border-l">
              <div className=" flex items-center justify-center w-[20vw]">
                <p className="text-sm font-medium text-green-600">
                  All enquiries
                </p>
              </div>
              <button className="bg-yellow-500 p-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* filter */}
        <div className="container mx-auto pt-10">
          <div className="flex flex-row items-center space-x-5 border-b">
            <button
              onClick={() => setTab(0)}
              className={`pb-5 ${tab === 0 ? "border-b-4 font-medium border-gray-600" : "pb-6"} text-gray-600 relative`}
            >
              Open Enquires
              <span className="absolute -top-3 bg-green-200 rouned-full text-xs w-5 h-5 rounded-full items-center justify-center flex -right-2 font-medium">
                {tabCount.open}
              </span>
            </button>
            <button
              onClick={() => setTab(1)}
              className={` ${tab === 1 ? "border-b-4 font-medium border-gray-600 pb-5" : "pb-6"} text-gray-600 relative`}
            >
              Closed Enquires
              <span className="absolute -top-3 bg-gray-200 rouned-full text-xs w-5 h-5 rounded-full items-center justify-center flex -right-2 font-medium">
                {tabCount.closed}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-2 grid-cols-2 container mx-auto">
        {/* cards start */}
        {filteredQueries.map((enquiry, index) => (
          <Link
            to={"/dashboard/enquiry/" + enquiry.id}
            key={`${index}-enquiry`}
            className="flex-1 min-h-20 bg-white/20 backdrop-blur-lg border p-5 flex-col space-y-5 cursor-pointer"
          >
            <div>
              <p className="text-xl leading-relaxed capitalize font-medium pb-2">
                {enquiry.subject}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-slate-500 leading-relaxed ">
                  {enquiry.emailAddress}
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-sm font-light px-2">{enquiry.category}</p>
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-sm font-light">
                  {enquiry?.createdAt
                    ? moment(enquiry.createdAt.seconds * 1000)
                        .startOf("hour")
                        .fromNow()
                    : "Time not available"}
                </p>
              </div>
            </div>
            {enquiry.attachment !== "" && (
              <div className="bg-yslate-100 shadow-sm border border-gray-100 min-h-16 rounded flex items-center justify-center space-x-2">
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
            <p className="flex leading-relaxed">
              {summarizeMessage(enquiry.message)}
            </p>
            {enquiry.message === "" && enquiry.attachment === "" && (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-gray-400 rounded"></div>
                  <div className="h-2 bg-gray-400 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
            )}
          </Link>
        ))}

        {/* card end */}
      </div>
    </div>
  );
}
