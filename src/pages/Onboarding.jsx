import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const [form, setForm] = useState({
    role: "",
    experience: "",
    country: "",
    goal: "",
  });
  const [saving, setSaving] = useState(false);
  const [roleSuggestionsVisible, setRoleSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const suggestedRoles = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "Mobile App Developer",
    "DevOps Engineer",
  ];

  const submit = async () => {
    setSaving(true);
    try {
      const token = await auth.currentUser.getIdToken();

      await fetch(`${import.meta.env.VITE_API_URL}/api/user/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      await refreshUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error submitting onboarding:", error);
    } finally {
      setSaving(false);
    }
  };

  // Filter suggestions based on input
  const filteredRoles = suggestedRoles.filter((role) =>
    role.toLowerCase().includes(form.role.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">
          Let’s personalize your experience
        </h2>

        {/* Role input with suggestions */}
        <div className="relative mb-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Target role (e.g. AI Engineer)"
            value={form.role}
            onChange={(e) => {
              setForm({ ...form, role: e.target.value });
              setRoleSuggestionsVisible(true);
            }}
            onBlur={() => setTimeout(() => setRoleSuggestionsVisible(false), 100)}
            onFocus={() => setRoleSuggestionsVisible(true)}
          />
          {roleSuggestionsVisible && form.role && filteredRoles.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
              {filteredRoles.map((role) => (
                <li
                  key={role}
                  className="p-2 hover:bg-indigo-100 cursor-pointer"
                  onMouseDown={() => {
                    setForm({ ...form, role });
                    setRoleSuggestionsVisible(false);
                  }}
                >
                  {role}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        >
          <option value="">Experience Level</option>
          <option>Student</option>
          <option>0–1 years</option>
          <option>1–3 years</option>
          <option>3+ years</option>
        </select>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Country / Job market"
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />

        <textarea
          className="w-full border p-3 rounded mb-6"
          placeholder="What’s your resume goal?"
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
        />

        <button
          onClick={submit}
          disabled={saving}
          className="bg-indigo-600 text-white w-full py-3 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
