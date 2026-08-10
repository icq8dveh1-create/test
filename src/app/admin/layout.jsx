import "./admin.css";

export const metadata = {
  title: "VELPAW Content Command",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
