"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.ok) {
      setError(result.error || "Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow">
      <div>
        <label htmlFor="login-email" className="block font-medium">
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block font-medium">
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <button
        data-testid="auth-login-submit"
        type="submit"
        className="w-full rounded-lg bg-slate-950 px-4 py-3 font-bold text-white"
      >
        Log In
      </button>
    </form>
  );
}