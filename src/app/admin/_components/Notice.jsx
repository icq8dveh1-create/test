export default function Notice({ error, saved }) {
  if (error) return <div className="admin-notice is-error" role="alert">{error}</div>;
  if (saved) return <div className="admin-notice is-success" role="status">Changes saved successfully.</div>;
  return null;
}
