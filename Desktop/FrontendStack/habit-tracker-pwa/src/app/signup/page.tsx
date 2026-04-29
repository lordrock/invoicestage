import Link from "next/link";
import SignupForm from "../../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-slate-600">Start tracking your habits today.</p>

        <div className="mt-6">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link className="font-bold text-slate-950 underline" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}