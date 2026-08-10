"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowSquareOut,
  FolderSimple,
  Gauge,
  Package,
  SignOut,
} from "@phosphor-icons/react";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/categories", label: "Categories", icon: FolderSimple },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminSidebar({ username }) {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <strong>VELPAW</strong><span>MOUNTS</span><small>Content Command</small>
      </div>
      <nav aria-label="Admin navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link className={active ? "is-active" : ""} href={href} key={href}><Icon size={20} weight={active ? "fill" : "regular"} />{label}</Link>;
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <span>Signed in as <b>{username}</b></span>
        <Link href="/" target="_blank"><ArrowSquareOut size={19} />View website</Link>
        <form action={logoutAction}><button type="submit"><SignOut size={19} />Sign out</button></form>
      </div>
    </aside>
  );
}
