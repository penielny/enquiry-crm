import AddClient from "@/components/AddClient";
import AddEnquiry from "@/components/AddEnquiry";
import { useAuth } from "@/context/authentication";
import { useModal } from "@/context/modals";
import React from "react";

export default function Dashboard() {
  const { isAddClient, toggleAddClient, toggleAddEnquiry, isAddEnquiry } =
    useModal();
  const { logout, authInfo } = useAuth();

  return (
    <div className="flex flex-col  flex-1">
      <div className="container  mx-auto flex flex-row items-center space-x-5 pt-10">
        <div>
          <img
            className="h-20 w-20 rounded-full shadow-sm"
            src={
              authInfo?.userInfo?.photoURL ||
              `https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg`
            }
          />
        </div>
        <div>
          <div>
            <p className="text-2xl font-medium">Welcome,</p>
            <p className="font-medium text-gray-500 text-base">
              {authInfo?.userInfo?.fullName}
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="h-full  flex  items-end pb-3 space-x-5">
          <button
            onClick={() => logout()}
            className="flex items-center space-x-3 text-red-500 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>

            <p> logout session</p>
          </button>
          <div className="flex item-center space-x-5 border-l pl-5"></div>
        </div>
      </div>

      <div className="container space-y-5 mx-auto flex flex-col pt-10">
        <h3 className="text-xl font-medium">Quick actions</h3>
        <div className="flex flex-row items-center space-x-5">
          <button
            onClick={() => toggleAddEnquiry(true)}
            className="flex flex-row border space-x-5 p-5 w-3/12 bg-opacity-30 hover:bg-green-500/20 hover:font-medium hover:text-gray-700 transition-all rounded-md border-gray-200 bg-gray-100 backdrop-blur-md"
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>

            <p>Record Enquiry</p>
          </button>

          <button
            onClick={() => toggleAddClient(true)}
            className="flex flex-row border space-x-5 p-5 w-3/12 bg-opacity-30 hover:bg-green-500/20 hover:font-medium hover:text-gray-700 transition-all rounded-md border-gray-200 bg-gray-100 backdrop-blur-md"
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
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            <p>Add Client</p>
          </button>
        </div>
      </div>

      {isAddClient && <AddClient />}
      {isAddEnquiry && <AddEnquiry />}
    </div>
  );
}
