export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="min-h-screen grid place-items-center bg-slate-950 text-white px-6"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Welcome to
        </p>
        <h1 className="mt-3 text-4xl font-bold">Habit Tracker</h1>
      </div>
    </main>
  );
}