"use client";

import { useState } from "react";

export default function ConfirmDeleteButton({ children = "Delete" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="admin-danger-button" type="button" onClick={() => setOpen(true)}>{children}</button>
      {open ? <div className="admin-confirm-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section className="admin-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
          <span>Destructive action</span><h2 id="admin-confirm-title">Confirm deletion</h2><p>This action cannot be undone. The selected record and its uploaded files will be removed.</p>
          <div><button type="button" onClick={() => setOpen(false)}>Cancel</button><button className="admin-danger-button" type="submit">Yes, delete</button></div>
        </section>
      </div> : null}
    </>
  );
}
