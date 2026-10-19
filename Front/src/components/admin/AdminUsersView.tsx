"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Search,
  Shield,
  User as UserIcon,
  Smartphone,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Filter,
} from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

interface PlatformUser {
  id: string
  name: string | null
  email: string
  role: "ADMIN" | "USER" | "STAFF"
  createdAt: string
  _count: {
    events: number
  }
}

const roleBadgeStyles: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  USER: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  STAFF: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
}

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <Shield className="w-3.5 h-3.5 text-purple-500" />,
  USER: <UserIcon className="w-3.5 h-3.5 text-blue-500" />,
  STAFF: <Smartphone className="w-3.5 h-3.5 text-emerald-500" />,
}

export function AdminUsersView() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = React.useState<PlatformUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL")
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null)

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<{ success: boolean; data: PlatformUser[] }>("/admin/users")
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load platform users")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async (userId: string, newRole: "ADMIN" | "USER" | "STAFF") => {
    try {
      setUpdatingId(userId)
      const res = await api.patch<{ success: boolean; message: string }>(`/admin/users/${userId}`, {
        role: newRole,
      })
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
        setMessage({ text: `Role updated to ${newRole}`, type: "success" })
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to update role", type: "error" })
    } finally {
      setUpdatingId(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${email}"? This action cannot be undone.`)) {
      return
    }

    try {
      setUpdatingId(userId)
      const res = await api.delete<{ success: boolean; message: string }>(`/admin/users/${userId}`)
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        setMessage({ text: "User account deleted successfully", type: "success" })
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to delete user", type: "error" })
    } finally {
      setUpdatingId(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Platform Administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Inspect, modify roles, and manage access privileges across all registered accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-card border shadow-sm">
              Total Users: <strong className="text-primary">{users.length}</strong>
            </span>
          </div>
        </div>

        {/* Feedback alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
              className="px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin Only</option>
              <option value="USER">User (Host) Only</option>
              <option value="STAFF">Staff Only</option>
            </select>
          </div>
        </div>

        {/* Users list / table */}
        {loading ? (
          <div className="bg-card rounded-2xl border p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading platform users...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 rounded-2xl border border-destructive/20 p-8 text-center text-destructive space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-background text-foreground text-xs font-semibold rounded-lg border shadow-sm hover:bg-muted"
            >
              Retry
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No users found</p>
            <p className="text-xs mt-1">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Current Role</th>
                    <th className="py-4 px-6">Events Created</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((userItem) => {
                    const isSelf = currentUser?.id === userItem.id
                    const isUpdating = updatingId === userItem.id

                    return (
                      <tr
                        key={userItem.id}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                              {userItem.name ? userItem.name[0] : userItem.email[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-2">
                                {userItem.name || "Unnamed User"}
                                {isSelf && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {userItem.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize tracking-wide shadow-2xs">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${roleBadgeStyles[userItem.role]}`}>
                              {roleIcons[userItem.role]}
                              {userItem.role}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-semibold text-foreground">
                            {userItem._count?.events || 0}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">events</span>
                        </td>

                        <td className="py-4 px-6 text-muted-foreground text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(userItem.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role selector dropdown */}
                            <select
                              disabled={isUpdating || isSelf}
                              value={userItem.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  userItem.id,
                                  e.target.value as "ADMIN" | "USER" | "STAFF"
                                )
                              }
                              aria-label={`Change role for ${userItem.name || userItem.email}`}
                              className="text-xs py-1.5 px-2.5 bg-muted/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 cursor-pointer"
                            >
                              <option value="USER">User (Host)</option>
                              <option value="ADMIN">Admin</option>
                              <option value="STAFF">Staff</option>
                            </select>

                            {/* Delete button (cannot delete self) */}
                            {!isSelf && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                title="Delete user"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
