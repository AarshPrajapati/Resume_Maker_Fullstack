import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Onboarding() {
  const [form, setForm] = useState({ role: "", experience: "", country: "", goal: "" });
  const [saving, setSaving] = useState(false);
  const [roleSuggestionsVisible, setRoleSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const suggestedRoles = [
    "AI Engineer", "Machine Learning Engineer", "Data Scientist",
    "Backend Developer", "Full Stack Developer", "Software Engineer",
    "Mobile App Developer", "DevOps Engineer"
  ];

  const submit = async () => {
    setSaving(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      await refreshUser();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = suggestedRoles.filter(role =>
    role.toLowerCase().includes(form.role.toLowerCase())
  );

  return (
    <AuthLayout title="Personalize Your Experience">
      <div className="relative mb-4">
        <input
          className="input-field"
          placeholder="Target role (e.g. AI Engineer)"
          value={form.role}
          onChange={(e) => { setForm({ ...form, role: e.target.value }); setRoleSuggestionsVisible(true); }}
          onBlur={() => setTimeout(() => setRoleSuggestionsVisible(false), 100)}
          onFocus={() => setRoleSuggestionsVisible(true)}
        />
        {roleSuggestionsVisible && form.role && filteredRoles.length > 0 && (
          <ul className="absolute z-10 w-full bg-slate-700 border border-slate-600 rounded mt-1 max-h-40 overflow-y-auto shadow">
            {filteredRoles.map(role => (
              <li
                key={role}
                className="p-2 hover:bg-indigo-500 cursor-pointer rounded"
                onMouseDown={() => { setForm({ ...form, role }); setRoleSuggestionsVisible(false); }}
              >
                {role}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        className="input-field mb-4"
        value={form.experience}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
      >
        <option value="">Experience Level</option>
        <option>Student</option>
        <option>0–1 years</option>
        <option>1–3 years</option>
        <option>3+ years</option>
      </select>

      <input
        className="input-field mb-4"
        placeholder="Country / Job market"
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />

      <textarea
        className="input-field mb-6 resize-none h-24"
        placeholder="What's your resume goal?"
        value={form.goal}
        onChange={(e) => setForm({ ...form, goal: e.target.value })}
      />

      <button onClick={submit} disabled={saving} className="primary-btn">
        {saving ? "Saving..." : "Continue"}
      </button>
    </AuthLayout>
  );
}
