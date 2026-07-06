import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Loader } from "@/components/feedback/Loader";
import { toast } from "@/components/feedback/Toast";

const ROLE_OPTIONS = ["SUPER_ADMIN", "CUSTOMER"];

export default function UsersPage() {
  const [users, setUsers] = useState(null);

  function load() {
    userService.getAllPaged({ size: 50 }).then((page) => setUsers(page.content));
  }

  useEffect(load, []);

  async function handleRoleChange(user, role) {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
    try {
      await userService.updateRole(user.id, role);
      toast.success(`${user.username}'s role updated to ${role}.`);
    } catch (err) {
      setUsers(previous);
      toast.error(err.response?.data?.message ?? "Failed to update role.");
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await userService.remove(user.id);
      toast.success("User deleted.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to delete user.");
    }
  }

  if (!users) return <Loader label="Loading users..." />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <div className="rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Username</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Organization</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-3 py-2">{u.username}</td>
                <td className="px-3 py-2 text-[var(--muted-foreground)]">{u.email}</td>
                <td className="px-3 py-2 text-[var(--muted-foreground)]">
                  {u.organization?.name ?? "-"}
                </td>
                <td className="px-3 py-2">
                  <select
                    className="h-8 rounded-md border border-[var(--input)] bg-[var(--background)] px-2 text-sm"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => handleDelete(u)}
                    className="text-[var(--destructive)] hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-3 text-center text-[var(--muted-foreground)]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
