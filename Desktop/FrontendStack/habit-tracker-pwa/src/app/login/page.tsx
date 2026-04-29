import Link from "next/link";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-slate-600">Log in to continue your streak.</p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-slate-600">
          Need an account?{" "}
          <Link className="font-bold text-slate-950 underline" href="/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}