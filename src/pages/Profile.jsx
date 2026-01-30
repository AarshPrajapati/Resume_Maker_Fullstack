import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { User, Briefcase, Globe, MapPin, Target, Trash2, Save, ArrowLeft, LogOut } from "lucide-react";

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
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
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
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Link>
          <button 
             onClick={logout}
             className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8 border-b border-slate-700/50 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
               <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
              <p className="text-slate-400 text-sm">Manage your personal information and preferences</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 mb-6 text-sm rounded-xl border ${message.includes("Error") || message.includes("Failed") ? "bg-red-500/10 border-red-500/20 text-red-200" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"}`}>
              {message}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="Ex: John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon={User}
              />
              <Input
                label="Target Role"
                placeholder="Ex: Software Engineer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                icon={Briefcase}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Years of Experience"
                placeholder="Ex: 5"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                icon={Target}
              />
              <Input
                label="Location"
                placeholder="Ex: New York, USA"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                icon={MapPin}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Career Goal
              </label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none text-slate-400">
                  <Globe size={18} /> 
                </div>
                <textarea
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none h-32"
                  placeholder="Summarize your professional goals..."
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleSave}
              isLoading={saving}
              className="md:flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>

            <Button
              onClick={handleDelete}
              variant="danger"
              className="md:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
