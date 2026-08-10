import AdminSidebar from "../_components/AdminSidebar";
import { requireAdmin } from "../../../lib/cms/auth";

export default async function ProtectedAdminLayout({ children }) {
  const user = await requireAdmin();
  return <div className="admin-app"><AdminSidebar username={user.username} /><div className="admin-main">{children}</div></div>;
}
