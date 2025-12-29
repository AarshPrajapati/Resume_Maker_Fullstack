import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import UserHeader from "./UserHeader";

export default function Chat() {
  return (
    <>
    <UserHeader />
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-xl font-semibold mb-4">Resume AI Chatbot</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
    </>
  );
}
