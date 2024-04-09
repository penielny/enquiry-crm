import React, { useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ConfrimDeleteClient({ clients = [], close }) {
  const [loading, setLoading] = useState(false);

  async function onDeleteClients() {
    setLoading(true);

    // Prepare an array to hold the results of delete operations (success or error)
    const deleteResults = [];

    try {
      // Map each clientId to a delete operation
      const deletePromises = clients.map(async (id) => {
        const docRef = doc(db, "clients", id);
        try {
          await deleteDoc(docRef); // Attempt to delete the document
          return { id, status: "success" }; // Return success status if deletion is successful
        } catch (error) {
          console.error(`Error deleting client ${id}:`, error);
          return { id, status: "error", message: error.message }; // Return error status if deletion fails
        }
      });

      // Use Promise.all to execute the deletion operations concurrently
      const results = await Promise.all(deletePromises);
      deleteResults.push(...results);

      // Filter results to find any that were not successful
      const errors = deleteResults.filter(
        (result) => result.status === "error",
      );

      if (errors.length > 0) {
        // Handle cases where some deletions failed
        toast.error(`${errors.length} client(s) could not be deleted.`);
      } else {
        // If all deletions were successful
        toast.success(`All clients successfully deleted.`);
      }
    } catch (error) {
      console.error("A critical error occurred:", error);
      toast.error("A critical error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

    close();
  }

  return (
    <>
      {/* close modal */}
      <div className="absolute -top-0 left-0 bottom-0 right-0  flex items-center justify-center">
        <div className="min-h-60 w-2/6 bg-white  shadow-sm z-10 rounded-lg p-5 flex flex-col space-y-3   items-center justify-center">
          <h3 className="text-center text-lg font-bold text-gray-600">
            Are you sure
          </h3>
          <p className="text-center text-sm text-gray-500 w-2/3">
            You are about to delete {clients.length} client(s), this action can
            not be undone.
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
              onClick={() => onDeleteClients()}
              className="flex-1 bg-red-400 flex items-center justify-center text-gray-100 p-3 rounded-full"
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
          className="bg-black/10 absolute top-0 left-0 bottom-0 right-0  flex items-center justify-center"
        ></div>
      </div>
    </>
  );
}
