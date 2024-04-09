import React, { useState } from "react";
import toast from "react-hot-toast";
export default function SendMessage({ close, clients }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    subject: "",
    message: "",
  });

  async function sendSms() {
    if (!clients.length || details.message === "")
      return toast.error(`Please fill the form.`);
    const resp = await fetch(`https://enquiry-crm-server.onrender.com/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers as needed
      },
      body: JSON.stringify({
        template: "general",
        message: details?.message,
        clients,
      }),
    });

    let respData = await resp.json();

    toast.success(`Mail has been sent.`);

    return respData;
  }

  async function sendEmailNotification() {
    if (details.subject === "" || details.message === "")
      return toast.error(`Please fill the form.`);
    const resp = await fetch(`https://enquiry-crm-server.onrender.com/smtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers as needed
      },
      body: JSON.stringify({
        template: "general",
        message: details.message,
        clients,
        subject: details.subject,
      }),
    });

    let respData = await resp.json();

    toast.success(`Mail has been sent.`);

    return respData;
  }

  async function onSend() {
    setLoading(true);
    try {
      if (tab) {
        // send sms
        await sendSms();
      } else {
        // send mail
        await sendEmailNotification();
      }

      close();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex">
      <div className="flex flex-1 flex-col justify-center relative overflow-hidden">
        <div className="w-2/4 mx-auto flex flex-col space-y-10 z-10 rounded-md bg-white overflow-hidden overflow-y-auto pb-5 h-[85vh] pt-10">
          <div className="border rounded-full w-fit mx-auto border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              <li className="me-2">
                <button
                  onClick={() => setTab(0)}
                  className={`inline-flex items-center justify-center p-4  rounded-t-lg  dark:text-blue-500   group ${tab === 0 ? "text-blue-600  active" : ""} `}
                  aria-current="page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  Email
                </button>
              </li>
              <li className="me-2 ">
                <button
                  onClick={() => setTab(1)}
                  className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600  dark:hover:text-gray-300 group ${tab === 1 ? "text-blue-600  active" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  SMS
                </button>
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-3">
              <h3 className="text-center text-lg font-bold">Compose Message</h3>
              <p className="text-center text-gray text-sm text-gray-500">
                Conpose and send message direct to Customers
              </p>
            </div>
            <div className="flex flex-col space-y-5 w-full items-center justify-center">
              {tab === 0 && (
                <div className=" transition-all flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-3/4 relative">
                  <input
                    disabled={tab === 1}
                    value={details?.subject}
                    onChange={(e) =>
                      setDetails((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    id="subject"
                    className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/subject"
                    type="text"
                    placeholder="Store ID"
                  />

                  <label
                    htmlFor="subject"
                    className="absolute text-gray-600 left-0 ml-4 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/subject:text-xs peer-focus/subject:-translate-y-5 ease-linear peer-placeholder-shown/subject:translate-y-0 peer-placeholder-shown/subject:text-base peer-placeholder-shown/subject:text-gray-500 "
                  >
                    Subject
                  </label>
                </div>
              )}

              <div className=" w-3/4 mx-auto flex flex-col space-y-3">
                <label>Message</label>
                <textarea
                  value={details.message}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="border rounded-md border-gray-200 overflow-hidden h-36 p-3"
                />
              </div>
            </div>

            <div className=" w-3/4 mx-auto ">
              <div className="flex justify-between flex-col space-y-2 items-center mt-2">
                <button
                  disabled={loading}
                  onClick={() => onSend()}
                  type="submit"
                  className="bg-yellow-500 w-full flex items-center justify-center p-4 rounded-md font-medium text-white text-sm"
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
                    "Sign in"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={close}
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/10 flex"
        />
      </div>
    </div>
  );
}
