import { useAuth } from "@/context/authentication";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, NavLink, Link } from "react-router-dom";
import { CgLoadbarDoc } from "react-icons/cg";
import { LuUser2 } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import { firebase_storage, firebase_auth, db } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
const navRoutes = [
  {
    name: "Dashboard",
    path: "",
    icon: "dashboard",
  },
  {
    name: "Clients",
    path: "/dashboard/clients",
    icon: "clients",
  },
  {
    name: "Enquiries",
    path: "/dashboard/enquiries",
    icon: "enquiries",
  },
];

export default function Navbar() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const profileImageInput = useRef(null);
  const { authInfo, token, updateProfilePhoto, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigation();
  const onUploadFile = (file) => {
    setLoading(true);
    try {
      if (file) {
        const storageRef = ref(firebase_storage, `/profiles/${token}}`);
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
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              updateProfile(firebase_auth.currentUser, {
                photoURL: url,
                displayName: "Peniel",
                phoneNumbers: "0546547509",
              })
                .then(() => {
                  updateProfilePhoto(url);
                  toast.success(`Profile picture updated succssfuly.`);
                  setShowProfileModal(false);
                })
                .catch((error) => {
                  toast.error(error.message);
                });
            });
          },
        );
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "asc"),
      limit(10),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update the state with the latest messages
      setNotifications(messagesData);

      // Additional logic to track updates
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let newNotification = notifications.map((noti_) => {
            if (noti_.id == change.doc.id) {
              return { ...noti_, new: true };
            }
            return { ...noti_, new: true };
          });
          toast(`you have a new notification`);
          // setNotifications(newNotification);
          console.log("New message:");
        }
      });
    });

    // Unsubscribe from the snapshot listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className=" border-b border-b-gray-200 bg-white backdrop-blur-sm bg-opacity-40 ">
        <div className="flex flex-row items-center container mx-auto py-5 space-x-10">
          <NavLink to="/dashboard">
            <img
              className="h-10"
              src={"https://www.phdc.gov.gh/img/logo/phdc-logo-simple.svg"}
            />
          </NavLink>
          <div className="flex-1 flex flex-row items-center space-x-5">
            {navRoutes.map((nav, index) => (
              <NavLink
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-gray-100 px-3 py-2 rounded-md leading-relaxed font-normal"
                    : "text-gray-500 leading-relaxed"
                }
                key={`nav_${index}`}
                to={nav.path}
              >
                {nav.name}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-row items-center space-x-5">
            <div className="flex flex-row cursor-pointer items-center space-x-3">
              <button
                disabled={loading}
                onClick={() => setShowNotificationsModal(true)}
                className="relative"
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
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-2 right-3 h-4 w-4 bg-red-400 flex items-center justify-center font-medium text-xs rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex flex-row cursor-pointer items-center space-x-3 border-l pl-3"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={
                  authInfo?.userInfo?.photoURL ||
                  `https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=`
                }
              />
              <p className="font-medium text-gray-500 text-base">
                {authInfo?.userInfo?.fullName}.
              </p>
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
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* notification modal */}
      {showNotificationsModal && (
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-black/10 z-10">
          {/* action click to close */}
          <div
            onClick={() => setShowNotificationsModal(false)}
            className=" absolute top-0 left-0 right-0 bottom-0"
          ></div>

          <div className="container mx-auto flex justify-end pt-20">
            <div className="w-3/12 min-h-40 max-h-[40vh] absolute bg-white shadow-sm rounded-md right-48 flex flex-col overflow-hidden">
              <div className="border-b p-3">
                <h3>Notifications</h3>
              </div>
              {!notifications.length ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="w-2/3 text-center text-sm text-gray-500 mx-auto">
                    You currently do not have any notifications
                  </p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
                  {notifications.map((noti, idx) => (
                    <Link
                      key={idx + "notification"}
                      to={`/dashboard/enquiry/${noti?.enuiryId}`}
                      onClick={() => setShowNotificationsModal(flase)}
                      className={`flex items-start p-3 space-x-2 cursor-pointer px-5 ${idx + 1 !== notifications.length && "border-b"} py-5`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>

                      <div className="flex flex-col items-start">
                        <p className="text-sm text-left font-medium leading-relaxed">
                          {noti?.enquiry?.subject || "Header placeholder"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Client just replied to the conversation
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* account modal */}
      {showProfileModal && (
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-black/10 z-10">
          {/* action click to close */}
          <div
            onClick={() => setShowProfileModal(false)}
            className=" absolute top-0 left-0 right-0 bottom-0"
          ></div>

          <div className="container mx-auto flex justify-end pt-20">
            <div className="w-2/12  absolute bg-white shadow-sm rounded-md  flex flex-col">
              <input
                onChange={(e) => {
                  onUploadFile(e.target.files[0]);
                }}
                ref={profileImageInput}
                type="file"
                accept=".png,.jpg.,.jpeg"
                className="hidden"
              />
              <button
                onClick={() => profileImageInput.current.click()}
                className="flex items-start p-3 space-x-2 cursor-pointer px-5 border-b"
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
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                  />
                </svg>

                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium">Upload Profile</p>
                  <p className="text-xs text-gray-400">Upload profile image</p>
                </div>
              </button>
              <div
                onClick={() => {
                  setShowProfileModal(false);
                  logout();
                }}
                className="flex items-start p-3 space-x-2 cursor-pointer px-5"
              >
                <TbLogout2 size={20} />
                <div>
                  <p className="text-sm font-medium">Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
