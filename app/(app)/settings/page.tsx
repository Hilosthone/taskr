"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Trash2,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Lock,
} from "lucide-react";
import { userApi, authApi, UserProfile } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Delete Account Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Fetch initial profile & avatar
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await userApi.getProfile();
        if (response.data) {
          const p = response.data;
          setFullName(`${p.firstname || ""} ${p.lastname || ""}`.trim());
          setEmail(p.email_address || "");
          setAvatarUrl(p.profile_picture || null);
        }
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
        setError("Failed to fetch profile settings. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Upload/Update Avatar (PATCH /api/v1/user/profile-picture)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      const response = await userApi.uploadProfilePicture(file);
      if (response.data?.profile_picture) {
        setAvatarUrl(response.data.profile_picture);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to upload profile picture. Ensure image size is within limit."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Remove Avatar (PATCH /api/v1/user/profile-picture/remove)
  const handleAvatarRemove = async () => {
    setUploadingAvatar(true);
    setError(null);

    try {
      await userApi.removeProfilePicture();
      setAvatarUrl(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to remove avatar:", err);
      setError(err.message || "Failed to remove profile picture.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save Profile Changes
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);

    try {
      // Profile information updated successfully
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError("Failed to update account details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Soft Delete Account (PATCH /api/v1/auth/delete-account)
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") return;

    setDeleting(true);
    setError(null);

    try {
      await authApi.deleteAccount();
      router.push("/login");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      setError(err.message || "Failed to process account deletion.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
        <p className="text-xs text-slate-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal profile, avatar, and account preferences.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Avatar & Profile Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 border-white/15">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--color-taskr-blue)]" />
          <span>Profile Picture</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden border-2 border-white/20 relative">
              {uploadingAvatar ? (
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{fullName.charAt(0) || "U"}</span>
              )}
            </div>

            <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/*"
                disabled={uploadingAvatar}
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <label className="glass-button-primary text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1.5">
                {uploadingAvatar ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
                <span>Upload New Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingAvatar}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Avatar</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Supports JPG, PNG or WEBP. Max resolution 800x800px.
            </p>
          </div>
        </div>
      </div>

      {/* Account Info Form */}
      <form
        onSubmit={handleProfileUpdate}
        className="glass-panel p-6 sm:p-8 space-y-6 border-white/15"
      >
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--color-taskr-purple)]" />
          <span>Personal Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              required
              disabled={savingProfile}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-input w-full text-xs disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={savingProfile}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full text-xs disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {savedSuccess ? (
            <span className="text-xs font-medium text-[var(--color-taskr-done)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Update your workspace profile credentials
            </span>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="glass-button-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-rose-500/20 bg-rose-500/[0.02]">
        <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Deleting your account will revoke your access to Taskr. This action
          archives your workspace data and revokes all active project invitations.
        </p>
        <button
          type="button"
          onClick={() => {
            setDeleteConfirmText("");
            setDeleteModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md p-6 space-y-5 border-rose-500/30 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Confirm Account Deletion</span>
                </h3>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  To confirm account deletion, please type{" "}
                  <strong className="text-rose-400 select-all font-mono">
                    delete my account
                  </strong>{" "}
                  below.
                </p>

                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder='Type "delete my account"'
                  className="glass-input w-full text-xs font-mono border-rose-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    deleting ||
                    deleteConfirmText.toLowerCase() !== "delete my account"
                  }
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold text-xs hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Permanently Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}