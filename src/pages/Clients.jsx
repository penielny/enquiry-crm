import React, { useEffect, useState } from "react";
import moment from "moment";
import { db } from "./../../firebase";

import { collection, onSnapshot, query } from "firebase/firestore";
import ConfrimDeleteClient from "@/components/ConfrimDelete";
import AddClient from "@/components/AddClient";
import { useModal } from "@/context/modals";
import SendMessage from "@/components/SendMessage";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [selctedAll, setSellectedAll] = useState(false);
  const [showDeleteClient, setShowDeleteClient] = useState(false);
  const { isAddClient, toggleAddClient } = useModal();
  const [editClient, setEditClient] = useState(null);
  const [showSendMessage, setShowSendMessage] = useState(false);

  function onSelectAll() {
    setSellectedAll(!selctedAll);
  }

  useEffect(() => {
    if (!isAddClient) {
      setEditClient(null);
    }
  }, [isAddClient]);

  useEffect(() => {
    if (!selctedAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((data) => data.id));
    }
  }, [selctedAll, clients]);

  useEffect(() => {
    // Create a query against the collection.
    const q = query(collection(db, "clients"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client?.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto flex-col overflow-y-auto no-scrollbar">
      <div className="py-10">
        <div className="flex items-center space-x-5 bg-white p-2 border border-gray-100 rounded px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            className="flex-1 py-2 outline-none border-l pl-3"
            type="text"
            placeholder="Search email address ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="text-yellow-600"
            onClick={() => setSearchQuery("")}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between pb-8">
        <p className="text-sm font-medium text-gray-600">
          {selectedClients.length && selectedClients.length > 1
            ? `${selectedClients.length} Clients Selected`
            : clients?.filter((client_) => client_.id === selectedClients[0])[0]
                ?.firstName}
        </p>
        <div className="flex items-center space-x-5">
          {selectedClients.length > 0 && (
            <button
              onClick={() => setShowSendMessage(true)}
              title="send message to selected client(s)"
              className="flex items-center space-x-2 bg-yellow-500 py-2 px-5 rounded text-white"
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p className="">Send message</p>
            </button>
          )}
          <button
            onClick={() => toggleAddClient(true)}
            className="flex items-center space-x-2 bg-green-600 py-2 px-5 rounded text-white"
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
            <p className="">Add Client</p>
          </button>
          {selectedClients.length > 0 && (
            <button
              onClick={() => setShowDeleteClient(true)}
              title="delete selected client(s)"
              className="bg-red-100 py-2 px-5 rounded text-red-600"
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
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="relative overflow-x-auto  border border-gray-100 sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    checked={selctedAll}
                    onChange={(e) => {
                      onSelectAll();
                    }}
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone number
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr
                key={client.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClients((prev) => [...prev, client.id]);
                        } else {
                          setSelectedClients((prev) => {
                            return prev.filter((data_) => data_ !== client.id);
                          });
                        }
                      }}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                    alt="Jese image"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="font-normal text-gray-500">
                      {client.emailAddress}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{client.phoneNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                    {client?.createdAt
                      ? moment(client.createdAt.seconds * 1000)
                          .startOf("hour")
                          .fromNow()
                      : "Time not available"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* <!-- Modal toggle --> */}
                  <button
                    href="#"
                    type="button"
                    onClick={() => {
                      setEditClient(client);
                      toggleAddClient(true);
                    }}
                    data-modal-target="editUserModal"
                    data-modal-show="editUserModal"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit user
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSendMessage && (
        <SendMessage
          clients={selectedClients}
          close={() => setShowSendMessage(false)}
        />
      )}

      {showDeleteClient && (
        <ConfrimDeleteClient
          clients={selectedClients}
          close={() => setShowDeleteClient(false)}
        />
      )}

      {isAddClient && <AddClient client={editClient} />}
    </div>
  );
}
