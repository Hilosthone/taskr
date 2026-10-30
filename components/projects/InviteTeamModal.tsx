"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X, RefreshCw, Ban, UserX, Loader2 } from "lucide-react";
import { Invitation, ProjectMember, ProjectRole } from "@/lib/api";

interface InviteTeamModalProps {
  isOpen: boolean;
  inviteEmail: string;
  setInviteEmail: (val: string) => void;
  inviteRole: ProjectRole;
  setInviteRole: (val: ProjectRole) => void;
  inviteSending: boolean;
  invitations: Invitation[];
  members: ProjectMember[];
  onClose: () => void;
  onSendInvite: (e: React.FormEvent) => void;
  onResendInvite: (id: string) => void;
  onRevokeInvite: (id: string) => void;
  onRemoveMember: (id: string) => void;
}

export default function InviteTeamModal({
  isOpen,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviteSending,
  invitations,
  members,
  onClose,
  onSendInvite,
  onResendInvite,
  onRevokeInvite,
  onRemoveMember,
}: InviteTeamModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-lg p-6 space-y-6 border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[var(--color-taskr-purple)]" />
                <span>Team & Pending Invitations</span>
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Send Invite Form */}
            <form onSubmit={onSendInvite} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="glass-input flex-1 text-xs"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
                  className="glass-input text-xs bg-[var(--color-taskr-surface)] text-slate-200"
                >
                  <option value="Project Manager">PM</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  disabled={inviteSending}
                  className="glass-button-primary text-xs px-3 cursor-pointer disabled:opacity-50"
                >
                  {inviteSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Invite"}
                </button>
              </div>
            </form>

            {/* Pending Invitations */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">
                Pending Invitations ({invitations.length})
              </h4>
              {invitations.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No pending invitations.</p>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs"
                  >
                    <span className="text-white truncate max-w-[180px]">{inv.inviteeEmail}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onResendInvite(inv._id)}
                        className="p-1 text-slate-300 hover:text-white cursor-pointer"
                        title="Resend Invite"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRevokeInvite(inv._id)}
                        className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Revoke Invite"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Active Members */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">
                Active Members ({members.length})
              </h4>
              {members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs"
                >
                  <span className="text-white">Role: {m.role}</span>
                  <button
                    onClick={() => onRemoveMember(m._id)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    title="Remove Member"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}