import React, { useState, useEffect } from "react";
import { 
  Users, 
  Key, 
  Mail, 
  Clock, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  RefreshCw, 
  Edit3, 
  Power,
  ChevronRight,
  Search,
  Settings,
  X
} from "lucide-react";

interface User {
  email: string;
  password?: string;
  dateCreated: string;
  status: "active" | "inactive";
}

interface LoginLog {
  email: string;
  role: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

interface EmailLog {
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailTemplate, setEmailTemplate] = useState("");
  
  // UI Tab state
  const [adminTab, setAdminTab] = useState<"users" | "logs" | "settings">("users");
  
  // Generate User state
  const [newEmail, setNewEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [customEmailBody, setCustomEmailBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userSuccessMessage, setUserSuccessMessage] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState("");
  
  // Edit User state
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [editingUserPassword, setEditingUserPassword] = useState("");
  
  // Change Admin Password state
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminPassSuccess, setAdminPassSuccess] = useState("");
  const [adminPassError, setAdminPassError] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  
  // Search users state
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, logsRes, templateRes] = await Promise.all([
        fetch("/api/auth/admin/users"),
        fetch("/api/auth/admin/logs"),
        fetch("/api/auth/admin/template")
      ]);
      
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLoginLogs(data.loginLogs || []);
        setEmailLogs(data.emailLogs || []);
      }
      if (templateRes.ok) {
        const data = await templateRes.json();
        setEmailTemplate(data.template || "");
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Secure Password Generator satisfying all rules
  const handleGeneratePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // Ensure at least one of each character category is included
    const chars = [
      lowercase[Math.floor(Math.random() * lowercase.length)],
      uppercase[Math.floor(Math.random() * uppercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    // Fill up to 12 characters to exceed minimum 10 constraint comfortably
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 0; i < 8; i++) {
      chars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    
    // Shuffle arrays
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = chars[i];
      chars[i] = chars[j];
      chars[j] = temp;
    }
    
    const password = chars.join("");
    setGeneratedPassword(password);
    
    // Auto populate the customized email body with the current templates and variables
    if (newEmail) {
      updateEmailDraft(newEmail, password);
    }
  };

  const updateEmailDraft = (email: string, pass: string) => {
    let draft = emailTemplate || "Hello,\n\nYour premium access passkey to the Cookbook Creator Toolkit has been generated!\n\nEmail: {{email}}\nPasskey: {{password}}\n\nUnlock your workspace here:\nhttps://ais-pre-gsws727m66k4mjg4baxo66-846308911848.us-east1.run.app";
    draft = draft.replace("{{email}}", email).replace("{{password}}", pass);
    setCustomEmailBody(draft);
  };

  // Keep email draft updated when typing email address or password manually
  useEffect(() => {
    if (newEmail || generatedPassword) {
      updateEmailDraft(newEmail, generatedPassword);
    }
  }, [newEmail, generatedPassword, emailTemplate]);

  const handleAddUserAndSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSuccessMessage("");
    setUserErrorMessage("");
    
    if (!newEmail.trim() || !generatedPassword) {
      setUserErrorMessage("Please provide both an email address and a generated passkey.");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Add user to database
      const userRes = await fetch("/api/auth/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: generatedPassword,
          status: "active"
        })
      });

      const userData = await userRes.json();
      
      if (!userRes.ok) {
        setUserErrorMessage(userData.message || "Failed to add user.");
        setIsGenerating(false);
        return;
      }

      // 2. Log simulated email dispatch
      await fetch("/api/auth/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: newEmail.trim(),
          subject: "🔑 Your Premium Cookbook Creator Passkey Is Ready!",
          body: customEmailBody
        })
      });

      setUserSuccessMessage(`Successfully registered ${newEmail.trim()} and logged access keys dispatch email!`);
      setNewEmail("");
      setGeneratedPassword("");
      setCustomEmailBody("");
      fetchData();
    } catch (err) {
      setUserErrorMessage("A network error occurred while establishing keys.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/auth/admin/users/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          status: nextStatus
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Are you absolutely sure you want to revoke access and delete user key: ${email}?`)) {
      return;
    }
    try {
      const res = await fetch("/api/auth/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleUpdateUserPassword = async (email: string) => {
    if (!editingUserPassword.trim()) return;
    try {
      const res = await fetch("/api/auth/admin/users/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: editingUserPassword.trim()
        })
      });
      if (res.ok) {
        setEditingUserEmail(null);
        setEditingUserPassword("");
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update password", err);
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassSuccess("");
    setAdminPassError("");

    if (!newAdminPassword.trim()) {
      setAdminPassError("Admin password cannot be blank.");
      return;
    }

    try {
      const res = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newAdminPassword.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminPassSuccess("Admin security passkey updated permanently!");
        setNewAdminPassword("");
      } else {
        setAdminPassError(data.message || "Failed to update admin password.");
      }
    } catch (err) {
      setAdminPassError("Network error. Could not save password.");
    }
  };

  const handleSaveEmailTemplate = async () => {
    try {
      const res = await fetch("/api/auth/admin/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: emailTemplate })
      });
      if (res.ok) {
        alert("Welcome email template updated successfully!");
      }
    } catch (err) {
      console.error("Failed to save template", err);
    }
  };

  // Filtered users
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto animate-fadeIn">
      {/* Admin Dashboard header */}
      <div className="bg-[#1C2C22] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 text-9xl">👑</div>
        <div className="relative z-10 space-y-2">
          <span className="bg-emerald-500/25 text-emerald-300 font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-400/20">
            Secure Administrator View
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black">
            Cookbook Creator Toolkit Control Panel
          </h2>
          <p className="text-sm text-neutral-300/90 max-w-xl leading-relaxed">
            Manage your premium user passkeys, monitor system logins, configure communication campaigns, and audit diagnostic telemetry logs.
          </p>
        </div>

        {/* Quick Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Testers Access</span>
            <strong className="text-2xl font-serif text-emerald-400">{users.length}</strong>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Active Logs Tracked</span>
            <strong className="text-2xl font-serif text-emerald-400">{loginLogs.length}</strong>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Campaigns Dispatched</span>
            <strong className="text-2xl font-serif text-emerald-400">{emailLogs.length}</strong>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">System Security Status</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Locked &amp; Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation sub-tabs inside Admin */}
      <div className="flex bg-white rounded-2xl border border-lightgray/55 p-1 max-w-md shadow-xs">
        {[
          { id: "users", label: "🔑 Testers Directory", icon: Users },
          { id: "logs", label: "📜 Activity Telemetry", icon: Clock },
          { id: "settings", label: "⚙️ Global Settings", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? "bg-sagedark text-white shadow-xs" 
                  : "text-midgray hover:text-charcoal hover:bg-neutral-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Admin Tab Views */}
      {adminTab === "users" && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Side: Key generator form */}
          <div className="lg:col-span-5 bg-white border border-lightgray/60 rounded-3xl p-6 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-sagedark" /> 
                Assign Tester Premium Access
              </h3>
              <p className="text-xs text-midgray leading-relaxed">
                Provide a tester's email address and generate a highly secure, verified compliance password to register their account.
              </p>
            </div>

            <form onSubmit={handleAddUserAndSendEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-sagedark uppercase block">
                  Tester Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter tester's email address..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lightgray focus:border-sagedark focus:ring-1 focus:ring-sagedark bg-[#FAF7F2]/30 text-charcoal text-sm outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-sagedark uppercase block">
                    Access Passkey
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-sagedark font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 animate-pulse" /> Generate Password
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    readOnly
                    placeholder="Click generate password..."
                    value={generatedPassword}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-lightgray bg-neutral-50 text-charcoal text-xs font-mono font-bold"
                  />
                </div>
                <p className="text-[9px] text-midgray italic">
                  * Password fulfills rules: At least 10 chars, uppercase, lowercase, number, and symbol.
                </p>
              </div>

              {/* Custom email preview */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold text-sagedark uppercase block">
                  Email Message Draft Preview
                </label>
                <textarea
                  rows={6}
                  value={customEmailBody}
                  onChange={(e) => setCustomEmailBody(e.target.value)}
                  placeholder="The system will populate template variables here..."
                  className="w-full p-3 rounded-xl border border-lightgray focus:border-sagedark focus:ring-1 focus:ring-sagedark bg-[#FAF7F2]/30 text-xs text-charcoal/80 font-sans leading-relaxed outline-hidden"
                />
                <p className="text-[9px] text-midgray italic leading-normal">
                  💡 This email is logged and saved to the outbox automatically for tracking. You can customize the body text exactly as you'd like before hitting send.
                </p>
              </div>

              {userErrorMessage && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-medium">
                  ⚠️ {userErrorMessage}
                </div>
              )}

              {userSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{userSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-sagedark hover:bg-sagedark/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    Registering Access...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Assign Access &amp; Log Outbox Email
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Registered Users table */}
          <div className="lg:col-span-7 bg-white border border-lightgray/60 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Registered Access Database
                </h3>
                <p className="text-xs text-midgray">
                  Verify passkeys, toggle user statuses, edit keys, or revoke privileges.
                </p>
              </div>

              <div className="relative w-full sm:w-48 shrink-0">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-lightgray bg-[#FAF7F2]/20 text-xs text-charcoal outline-hidden"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-midgray" />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-midgray space-y-2">
                <span className="h-5 w-5 border-2 border-sagedark/30 border-t-sagedark rounded-full animate-spin inline-block" />
                <p>Loading database directory...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-lightgray/55 rounded-2xl text-center text-xs text-midgray space-y-2">
                <Users className="h-8 w-8 text-neutral-300 mx-auto" />
                <p>No registered testers found matching search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-lightgray/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/85 border-b border-lightgray/60 font-bold text-charcoal/80">
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Passkey</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => {
                      const isEditing = editingUserEmail === u.email;
                      return (
                        <tr key={u.email} className="hover:bg-neutral-50/45 transition-colors">
                          <td className="p-3 font-medium">
                            <span className="block truncate max-w-[150px] sm:max-w-xs" title={u.email}>
                              {u.email}
                            </span>
                            <span className="block text-[9px] text-midgray mt-0.5">
                              Created: {new Date(u.dateCreated).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3 font-mono">
                            {isEditing ? (
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={editingUserPassword}
                                  onChange={(e) => setEditingUserPassword(e.target.value)}
                                  className="px-1.5 py-0.5 border border-lightgray rounded text-xs w-28 bg-white font-bold"
                                />
                                <button
                                  onClick={() => handleUpdateUserPassword(u.email)}
                                  className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingUserEmail(null)}
                                  className="bg-neutral-200 text-charcoal px-1.5 py-0.5 rounded text-[10px]"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <span className="text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {u.password || "Legacy Key"}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                                u.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 hover:bg-red-100"
                              }`}
                            >
                              <Power className="h-2 w-2" />
                              {u.status}
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingUserEmail(u.email);
                                setEditingUserPassword(u.password || "");
                              }}
                              title="Edit Passkey"
                              className="text-neutral-500 hover:text-sagedark inline-block p-1 hover:bg-neutral-100 rounded cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.email)}
                              title="Delete Tester"
                              className="text-neutral-400 hover:text-red-600 inline-block p-1 hover:bg-neutral-100 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {adminTab === "logs" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Login Telemetry Tracking */}
          <div className="bg-white border border-lightgray/60 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Clock className="h-5 w-5 text-sagedark" /> 
                System Access Telemetry Logs
              </h3>
              <p className="text-xs text-midgray">
                Real-time tracking of successful administrative and tester logins.
              </p>
            </div>

            {loginLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-midgray border border-dashed border-lightgray/55 rounded-2xl">
                No logins tracked in this execution instance yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
                {loginLogs.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-neutral-100 bg-[#FAF7F2]/30 space-y-1.5 hover:border-sagelight/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-charcoal truncate block max-w-[180px]">{log.email}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        log.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {log.role}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-midgray font-mono leading-normal">
                      <div>IP: {log.ip}</div>
                      <div className="text-right">{new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="text-[9px] text-neutral-400 truncate mt-1">
                      Agent: {log.userAgent}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Outbox Logs */}
          <div className="bg-white border border-lightgray/60 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Mail className="h-5 w-5 text-sagedark" /> 
                Dispatched Communication Outbox
              </h3>
              <p className="text-xs text-midgray">
                Record of generated credentials and custom templates logged by the toolkit.
              </p>
            </div>

            {emailLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-midgray border border-dashed border-lightgray/55 rounded-2xl">
                No custom access campaign emails logged yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
                {emailLogs.map((email, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-neutral-100 bg-white space-y-2 hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-center text-[10px] text-midgray">
                      <span>To: <strong className="text-charcoal font-bold text-xs">{email.to}</strong></span>
                      <span className="font-mono">{new Date(email.timestamp).toLocaleDateString()} {new Date(email.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs font-bold text-sagedark">{email.subject}</div>
                    <div className="bg-neutral-50 p-2.5 rounded-lg text-[10px] font-mono text-charcoal/80 whitespace-pre-wrap max-h-32 overflow-y-auto border border-neutral-100">
                      {email.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {adminTab === "settings" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Template Manager */}
          <div className="bg-white border border-lightgray/60 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <FileText className="h-5 w-5 text-sagedark" /> 
                Welcome Passkey Template
              </h3>
              <p className="text-xs text-midgray">
                Set up the default draft body loaded when assigning new users. Use <code>{"{{email}}"}</code> and <code>{"{{password}}"}</code> as tags.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={10}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="w-full p-3 rounded-xl border border-lightgray focus:border-sagedark focus:ring-1 focus:ring-sagedark bg-[#FAF7F2]/30 text-xs text-charcoal font-sans leading-relaxed outline-hidden"
              />

              <button
                type="button"
                onClick={handleSaveEmailTemplate}
                className="w-full py-2.5 bg-sagedark hover:bg-sagedark/90 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Save Welcome Email Template Permanently
              </button>
            </div>
          </div>

          {/* Admin Security Password Manager */}
          <div className="bg-white border border-lightgray/60 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Lock className="h-5 w-5 text-sagedark" /> 
                Update Security Credentials
              </h3>
              <p className="text-xs text-midgray">
                Update your administrator password. This saves permanently inside the server file database.
              </p>
            </div>

            <form onSubmit={handleChangeAdminPassword} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-sagedark uppercase block">
                  Admin Email (Locked)
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value="ogrlbdesigns@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lightgray bg-neutral-100 text-charcoal text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-sagedark uppercase block">
                  New Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showAdminPass ? "text" : "password"}
                    required
                    placeholder="Enter new admin passkey..."
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-lightgray focus:border-sagedark focus:ring-1 focus:ring-sagedark bg-[#FAF7F2]/30 text-charcoal text-xs font-mono leading-none outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-2.5 text-midgray hover:text-charcoal"
                  >
                    {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {adminPassError && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-xs font-medium">
                  ⚠️ {adminPassError}
                </div>
              )}

              {adminPassSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl text-xs font-medium">
                  ✨ {adminPassSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-sagedark hover:bg-sagedark/90 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Change Admin Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
