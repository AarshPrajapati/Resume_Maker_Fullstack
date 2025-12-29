import { useAuth } from "../context/AuthContext";

export default function UserHeader() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <div>
        <p className="font-medium">
          Hi, {user?.displayName || user?.email}
        </p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
