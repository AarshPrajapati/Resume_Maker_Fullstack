import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, dbUser, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    role: "",
    experience: "",
    country: "",
    goal: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (dbUser) {
      setForm({
        name: dbUser.name || "",
        role: dbUser.onboarding?.role || "",
        experience: dbUser.onboarding?.experience || "",
        country: dbUser.onboarding?.country || "",
        goal: dbUser.onboarding?.goal || "",
      });
    }
  }, [dbUser]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        refreshUser();
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        logout();
        window.location.href = "/login";
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {message && (
          <p className="text-green-400 bg-green-900/30 rounded px-3 py-2 mb-4 text-center">
            {message}
          </p>
        )}

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <textarea
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Goal"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          />
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium shadow-md transition-all duration-300"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium shadow-md transition-all duration-300"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
