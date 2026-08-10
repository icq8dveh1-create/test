import { redirect } from "next/navigation";
import { LockKey, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { getAdminUser } from "../../../lib/cms/auth";
import { loginAction } from "../actions";
import SubmitButton from "../_components/SubmitButton";

export default async function AdminLoginPage({ searchParams }) {
  if (await getAdminUser()) redirect("/admin");
  const { error = "" } = await searchParams;
  return (
    <main className="admin-login-page">
      <section className="admin-login-brand">
        <div className="admin-login-mark"><strong>VELPAW</strong><span>MOUNTS</span></div>
        <p>CONTENT COMMAND</p>
        <h1>Manage the catalog.<br />Keep the website fast.</h1>
        <ul><li><ShieldCheck size={20} weight="fill" />Protected product and category management</li><li><ShieldCheck size={20} weight="fill" />No storefront plugins or checkout overhead</li><li><ShieldCheck size={20} weight="fill" />Public website code stays isolated</li></ul>
      </section>
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-icon"><LockKey size={28} weight="bold" /></div>
        <span>Secure access</span>
        <h2 id="admin-login-title">Sign in to VELPAW</h2>
        <p>Enter the administrator credentials to manage website content.</p>
        {error ? <div className="admin-notice is-error" role="alert">{error}</div> : null}
        <form action={loginAction}>
          <label><span>Username <b>*</b></span><input name="username" autoComplete="username" placeholder="Administrator username" required autoFocus /></label>
          <label><span>Password <b>*</b></span><input name="password" type="password" autoComplete="current-password" placeholder="Administrator password" required /></label>
          <SubmitButton className="admin-login-button">Sign in</SubmitButton>
        </form>
        <a href="/">← Return to website</a>
      </section>
    </main>
  );
}
