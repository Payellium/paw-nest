
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaCat, FaEye, FaEyeSlash, FaPaw } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-3 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-violet-200 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-violet-100/80";

  const labelClass = "mb-1.5 block text-base font-semibold text-slate-700";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F8FAFC] px-4 py-5 sm:px-6 lg:h-screen lg:min-h-[680px] lg:overflow-y-auto lg:py-6">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#DFF4FF] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#E9D8FD] opacity-60 blur-3xl" />

      <FaPaw className="pointer-events-none absolute left-[7%] top-[14%] hidden rotate-[-20deg] text-4xl text-violet-200/60 sm:block" />
      <FaPaw className="pointer-events-none absolute bottom-[13%] right-[7%] hidden rotate-[18deg] text-5xl text-emerald-200/70 sm:block" />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white bg-white/90 shadow-[0_24px_80px_-28px_rgba(124,58,237,0.25)] backdrop-blur-sm md:grid-cols-[0.82fr_1.18fr]">
        {/* Welcome panel */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#DFF4FF] via-[#E9D8FD] to-[#D8F3DC] px-6 py-8 text-center sm:px-9 sm:py-9 lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/40" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/50" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/20 blur-2xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl border border-white/80 bg-white/75 text-[#7C3AED] shadow-lg shadow-violet-200/40">
              <FaCat className="text-4xl" />
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
              A little more love
            </p>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-800 sm:text-4xl">
              Welcome to
              <span className="mt-1 block text-[#7C3AED]">PawNest</span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">
              Every cat deserves a loving home. Join our community and
              help make that happen, one paw at a time.
            </p>

            <div className="mt-6 rounded-2xl border border-white/70 bg-white/45 p-4 text-left backdrop-blur-md sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg text-[#7C3AED]">
                  <FaPaw />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    A home full of love
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Discover adoptable cats and help furry friends find
                    a new beginning.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Made for cat lovers, by cat lovers
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="px-6 py-8 sm:px-10 sm:py-9 lg:px-12 lg:py-7 xl:px-14">
          <div className="mx-auto max-w-md">
            <div className="mb-5">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-[#7C3AED]">
                <FaPaw className="text-[10px]" />
                YOUR PAWNEST ACCOUNT
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                Create account
              </h2>

              <p className="mt-1.5 text-base leading-6 text-slate-500">
                Your next beautiful chapter starts here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-slate-400 transition hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-slate-400 transition hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm leading-5 text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#7C3AED] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-200/70 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Creating your account..." : "Create my account"}
                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-sm text-slate-400">
                Already a member?
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <p className="text-center text-base text-slate-600">
              Welcome back?{" "}
              <Link
                href="/login"
                className="font-bold text-[#7C3AED] underline decoration-violet-200 underline-offset-4 transition hover:text-violet-800 hover:decoration-violet-500"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to use PawNest responsibly
              and help keep our feline friends safe.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
