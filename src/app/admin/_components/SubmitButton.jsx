"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children = "Save changes", className = "admin-primary-button" }) {
  const { pending } = useFormStatus();
  return <button className={className} type="submit" disabled={pending}>{pending ? "Saving…" : children}</button>;
}
