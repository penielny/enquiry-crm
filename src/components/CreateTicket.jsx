import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function ConfirmCloseModal({ id, close }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onCompleteEnquiry() {
    setLoading(true);
    try {
      const docRef = doc(db, "enquiry", id);
      await updateDoc(docRef, {
        enquiryClosed: true,
      });
      toast.success(`Enquiry successfully closed.`);
      close();
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* close modal */}
      <div className="bg-black/30 absolute -top-24 left-0 bottom-0 right-0  flex items-center justify-center">
        <div className="min-h-60 w-2/6 bg-white  shadow-sm z-10 rounded-lg p-5 flex flex-col space-y-3   items-center justify-center">
          <h3 className="text-center text-xl font-bold text-gray-600">
            Mark Complete
          </h3>
          <p className="text-center text-sm text-gray-500 w-2/3">
            Are you sure want want to mark this equiry as address and ready to
            be closed
          </p>
          <div className="flex flex-row items-center w-4/5 space-x-3 pt-3">
            <button
              onClick={close}
              className="flex-1 bg-gray-100 p-3 rounded-full"
            >
              Close
            </button>
            <button
              disabled={loading}
              onClick={() => onCompleteEnquiry()}
              className="flex-1 bg-green-400 text-gray-100 p-3 rounded-full"
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
                "Yes"
              )}
            </button>
          </div>
        </div>
        {/* close */}
        <div
          onClick={close}
          className="bg-black/30 absolute -top-24 left-0 bottom-0 right-0  flex items-center justify-center"
        ></div>
      </div>
    </>
  );
}
