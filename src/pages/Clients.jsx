import React, { useEffect, useState } from "react";
import moment from "moment";
import { db } from "./../../firebase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="container mx-auto">
      <div className="py-10">
        <div className="flex items-center space-x-5 bg-white p-2 border rounded px-3">
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
      <Table>
        <TableCaption>List of clients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client, index) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{client.firstName}</TableCell>
              <TableCell>{client.lastName}</TableCell>
              <TableCell>{client.emailAddress}</TableCell>
              <TableCell>{client.phoneNumber}</TableCell>
              <TableCell className="text-right">
                {client?.createdAt
                  ? moment(client.createdAt.seconds * 1000)
                      .startOf("hour")
                      .fromNow()
                  : "Time not available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
